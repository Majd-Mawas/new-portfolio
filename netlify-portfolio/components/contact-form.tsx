'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, LoaderCircle } from 'lucide-react';
import { budgets, projectTypes } from '@/lib/contact-options';
import { submitContact } from '@/lib/contact';

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const startedAt = useRef(0);
  const inFlight = useRef(false);
  useEffect(() => { startedAt.current = Date.now(); }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    inFlight.current = true;
    setSending(true);
    setStatus(null);
    try {
      const result = await submitContact({ ...Object.fromEntries(new FormData(form)), startedAt: startedAt.current });
      setStatus({ type: result.success ? 'success' : 'error', message: result.message });
      if (result.success) { form.reset(); startedAt.current = Date.now(); }
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  return <form className="contact-form" onSubmit={submit} aria-busy={sending}>
    <h3 className="form-heading">Tell me what you’re working on.</h3>
    <div className="form-row">
      <label>Your name<input name="name" autoComplete="name" placeholder="Alex Morgan" required minLength={2} maxLength={100}/></label>
      <label>Email address<input name="email" type="email" autoComplete="email" placeholder="alex@company.com" required maxLength={254}/></label>
    </div>
    <div className="form-row">
      <label>Project type<select name="projectType" required defaultValue=""><option value="" disabled>Select a service</option>{projectTypes.map(type => <option key={type}>{type}</option>)}</select></label>
      <label>Budget <span>(optional)</span><select name="budget" defaultValue=""><option value="">Select a range</option>{budgets.map(budget => <option key={budget}>{budget}</option>)}</select></label>
    </div>
    <label>A little about your project<textarea name="message" placeholder="What are you building, improving, or trying to solve?" required minLength={20} maxLength={5000} rows={5}/></label>
    <div className="honeypot" aria-hidden="true"><label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <button className="button primary" type="submit" disabled={sending}>{sending ? 'Sending your message…' : 'Send project inquiry'}{sending ? <LoaderCircle size={16}/> : <ArrowUpRight size={17}/>}</button>
    <div aria-live="polite" aria-atomic="true">{status && <p className={`form-status ${status.type}`}>{status.message}</p>}</div>
    <p className="form-note">Your details are used to respond to your inquiry. Submissions are processed by Web3Forms. Prefer email? <a href="mailto:majd.mawass@gmail.com">Email Majd directly</a>.</p>
    <noscript><p className="form-note">Please enable JavaScript to use the form, or email majd.mawass@gmail.com.</p></noscript>
  </form>;
}
