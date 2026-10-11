import { z } from 'zod';
import { budgets, projectTypes } from './contact-options.ts';

// Web3Forms access keys are public form identifiers, designed for browser use.
const accessKey = 'e994ded9-59ab-4e7d-8fca-41c281802ff7';
const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(100).regex(/^[^\r\n]+$/, 'Enter your name on one line.'),
  email: z.string().trim().email('Please enter a valid email address.').max(254),
  projectType: z.enum(projectTypes),
  budget: z.enum(budgets).or(z.literal('')).optional(),
  message: z.string().trim().min(20, 'Please tell me a little more (at least 20 characters).').max(5000),
  website: z.string().max(200).optional(),
  startedAt: z.number().finite(),
});
export type ContactResult = { success: boolean; message: string };
const failure = (message: string): ContactResult => ({ success: false, message });

// Keep this request in the browser: server-side Web3Forms usage needs a paid plan.
export async function submitContact(payload: unknown, fetcher: typeof fetch = fetch): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? 'Please check the form fields.');
  const data = parsed.data;
  if (data.website || Date.now() - data.startedAt < 2500) return failure('Please wait a moment and try again.');
  try {
    const response = await fetcher('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Portfolio inquiry: ${data.projectType}`,
        from_name: 'Majd Mawas Portfolio',
        name: data.name,
        email: data.email,
        project_type: data.projectType,
        budget: data.budget || 'Not specified',
        message: data.message,
        botcheck: false,
      }),
      signal: AbortSignal.timeout(30_000),
    });
    if (response.status === 429) return failure('Too many requests right now. Please try later or email majd.mawass@gmail.com.');
    const receipt: unknown = await response.json();
    if (!response.ok || !receipt || typeof receipt !== 'object' || !('success' in receipt) || receipt.success !== true) {
      return failure('Your message could not be sent. Please try again or email majd.mawass@gmail.com directly.');
    }
    return { success: true, message: 'Your message has been submitted. Thanks for getting in touch — I’ll reply by email.' };
  } catch {
    return failure('Delivery could not be confirmed. Please try again or email majd.mawass@gmail.com directly.');
  }
}
