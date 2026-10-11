import { z } from 'zod';
import { budgets, projectTypes } from './contact-options.ts';
export type ContactConfig = { RESEND_API_KEY?: string; CONTACT_FROM?: string; TURNSTILE_SITE_KEY?: string; TURNSTILE_SECRET_KEY?: string };
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(100).regex(/^[^\r\n]+$/, 'Enter your name on one line.'),
  email: z.string().trim().email('Please enter a valid email address.').max(254),
  projectType: z.enum(projectTypes),
  budget: z.enum(budgets).or(z.literal('')).optional(),
  message: z.string().trim().min(20, 'Please tell me a little more (at least 20 characters).').max(5000),
  website: z.string().max(200).optional(),
  startedAt: z.number().finite(),
  token: z.string().min(1, 'Please complete the security check.').max(2048),
});
export function deliveryConfigured(config: ContactConfig) { return Boolean(config.RESEND_API_KEY && config.CONTACT_FROM && config.TURNSTILE_SITE_KEY && config.TURNSTILE_SECRET_KEY); }
const reply = (status: number, message: string) => Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });
export async function handleContact(request: Request, config: ContactConfig, fetcher: typeof fetch = fetch): Promise<Response> {
  const origin = new URL(request.url).origin;
  if (request.headers.get('origin') !== origin) return reply(403, 'Please submit this form from the portfolio website.');
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415, 'Please submit the contact form as JSON.');
  if (Number(request.headers.get('content-length') || 0) > 16_384) return reply(413, 'Your message is too long.');
  let payload: unknown;
  try {
    if (!request.body) return reply(400, 'Your message could not be read.');
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = []; let length = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; length += value.length; if (length > 16_384) { await reader.cancel(); return reply(413, 'Your message is too long.'); } chunks.push(value); }
    const bytes = new Uint8Array(length); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    payload = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return reply(400, 'Your message could not be read. Please try again.'); }
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) return reply(400, parsed.error.issues[0]?.message ?? 'Please check the form fields.');
  const data = parsed.data;
  if (data.website || Date.now() - data.startedAt < 2500 || data.startedAt > Date.now()) return reply(400, 'Please wait a moment and try again.');
  if (!deliveryConfigured(config)) return reply(503, 'The contact form is not accepting messages yet. Please email majd.mawass@gmail.com directly.');
  try {
    const verification = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret: config.TURNSTILE_SECRET_KEY, response: data.token }), signal: AbortSignal.timeout(10_000) });
    const result = await verification.json() as { success?: boolean; hostname?: string; action?: string };
    if (!verification.ok || !result.success || result.hostname !== new URL(request.url).hostname || result.action !== 'contact') return reply(400, 'The security check expired or failed. Please complete it again.');
    const sent = await fetcher('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${config.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact-${await tokenHash(data.token)}` }, body: JSON.stringify({ from: config.CONTACT_FROM, to: ['majd.mawass@gmail.com'], reply_to: data.email, subject: `Portfolio inquiry: ${data.projectType}`, text: `Name: ${data.name}\nEmail: ${data.email}\nProject: ${data.projectType}\nBudget: ${data.budget || 'Not specified'}\n\n${data.message}` }), signal: AbortSignal.timeout(12_000) });
    if (!sent.ok) return reply(502, 'Your message could not be sent. Please try again or email majd.mawass@gmail.com directly.');
    const receipt = await sent.json() as { id?: string };
    if (!receipt.id) return reply(502, 'Delivery could not be confirmed. Please email majd.mawass@gmail.com directly.');
    return reply(200, 'Your message has been submitted. Thanks for getting in touch — I’ll reply by email.');
  } catch { return reply(502, 'The email service is temporarily unavailable. Please try again or email majd.mawass@gmail.com.'); }
}
async function tokenHash(token: string) { const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)); return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join(''); }
