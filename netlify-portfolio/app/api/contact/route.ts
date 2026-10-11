import { deliveryConfigured, handleContact, type ContactConfig } from '@/lib/contact';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
function config(): ContactConfig { return { RESEND_API_KEY: process.env.RESEND_API_KEY, CONTACT_FROM: process.env.CONTACT_FROM, TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY }; }
export function GET() { const values = config(); return Response.json({ enabled: deliveryConfigured(values), siteKey: values.TURNSTILE_SITE_KEY || null }, { headers: { 'Cache-Control': 'no-store' } }); }
export function POST(request: Request) { return handleContact(request, config()); }
