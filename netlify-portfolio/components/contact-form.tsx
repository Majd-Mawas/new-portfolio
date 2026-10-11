'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, LoaderCircle } from 'lucide-react';
import { budgets, projectTypes } from '@/lib/contact-options';
type Turnstile = { render: (element: HTMLElement, options: Record<string, unknown>) => string; reset: (id: string) => void; remove: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }
export function ContactForm() {
  const [config, setConfig] = useState<{ enabled: boolean; siteKey?: string | null } | null>(null);
  const [token, setToken] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const startedAt = useRef(0); const container = useRef<HTMLDivElement>(null); const widget = useRef<string | null>(null);
  useEffect(() => { startedAt.current = Date.now(); const controller = new AbortController(); fetch('/api/contact', { signal: controller.signal }).then(r => { if (!r.ok) throw new Error(); return r.json() as Promise<{ enabled: boolean; siteKey?: string | null }>; }).then(setConfig).catch(() => { if (!controller.signal.aborted) setConfig({ enabled: false }); }); return () => controller.abort(); }, []);
  useEffect(() => {
    if (!config?.enabled || !config.siteKey) return;
    let active = true;
    function render() { if (!active || !container.current || !window.turnstile || widget.current) return; widget.current = window.turnstile.render(container.current, { sitekey: config!.siteKey, action: 'contact', theme: 'auto', callback: (value: string) => setToken(value), 'expired-callback': () => setToken(''), 'error-callback': () => { setToken(''); setStatus({ type: 'error', message: 'Security verification could not load. Try again or use the email link.' }); } }); }
    let script = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
    if (!script) { script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.dataset.turnstile = 'true'; document.head.appendChild(script); }
    script.addEventListener('load', render); render();
    return () => { active = false; script?.removeEventListener('load', render); if (widget.current) window.turnstile?.remove(widget.current); widget.current = null; };
  }, [config]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (sending) return;
    const form = event.currentTarget; const data = new FormData(form);
    setSending(true); setStatus(null);
    try { const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(data), startedAt: startedAt.current, token }), signal: AbortSignal.timeout(30_000) }); const result = await response.json() as { message?: string }; setStatus({ type: response.ok ? 'success' : 'error', message: result.message || 'Something went wrong. Please use the email link.' }); if (response.ok) { form.reset(); startedAt.current = Date.now(); } }
    catch { setStatus({ type: 'error', message: 'The connection was interrupted. Please try again or email Majd directly.' }); }
    finally { setSending(false); setToken(''); if (widget.current) window.turnstile?.reset(widget.current); }
  }
  return <form className="contact-form" onSubmit={submit}><h3 className="form-heading">Tell me what you’re working on.</h3><div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="Alex Morgan" required minLength={2} maxLength={100}/></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="alex@company.com" required maxLength={254}/></label></div><div className="form-row"><label>Project type<select name="projectType" required defaultValue=""><option value="" disabled>Select a service</option>{projectTypes.map(type => <option key={type}>{type}</option>)}</select></label><label>Budget <span>(optional)</span><select name="budget" defaultValue=""><option value="">Select a range</option>{budgets.map(budget => <option key={budget}>{budget}</option>)}</select></label></div><label>A little about your project<textarea name="message" placeholder="What are you building, improving, or trying to solve?" required minLength={20} maxLength={5000} rows={5}/></label><div className="honeypot" aria-hidden="true"><label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off"/></label></div>{config?.enabled && <div ref={container} className="turnstile-container"/>}{config && !config.enabled && <p className="form-status">Prefer a direct conversation? <a href="mailto:majd.mawass@gmail.com">Email Majd</a>. Form delivery is being set up.</p>}<button className="button primary" type="submit" disabled={!config?.enabled || !token || sending}>{sending ? 'Sending your message…' : 'Send project inquiry'}{sending ? <LoaderCircle size={16}/> : <ArrowUpRight size={17}/>}</button><div aria-live="polite" aria-atomic="true">{status && <p className={`form-status ${status.type}`}>{status.message}</p>}</div><p className="form-note">Your details are used only to respond to your inquiry. Submissions are processed by Resend, with spam protection by Cloudflare Turnstile.</p><noscript><p className="form-note">Please enable JavaScript to use the form, or email majd.mawass@gmail.com.</p></noscript></form>;
}

