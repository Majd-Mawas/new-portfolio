'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
const links = [['Work', '#work'], ['About', '#about'], ['Experience', '#experience'], ['Services', '#services']];
export function Navigation({ home = true }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { setLight(document.documentElement.dataset.theme === 'light'); }, []);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  function toggleTheme() { const value = !light; setLight(value); document.documentElement.dataset.theme = value ? 'light' : 'dark'; try { localStorage.setItem('majd-theme', value ? 'light' : 'dark'); } catch {} }
  return <header className="header"><div className="nav wrap"><a href="/" className="brand" aria-label="Majd Mawas home"><span className="monogram">m<span>.</span></span><span>majd mawas<span className="brand-dot">.</span></span></a><nav className="desktop-nav" aria-label="Main navigation">{links.map(([name, href]) => <a key={name} href={`${home ? '' : '/'}${href}`}>{name}</a>)}</nav><div className="nav-actions"><button className="icon-button theme-toggle" aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'} onClick={toggleTheme}>{light ? <Moon size={17}/> : <Sun size={17}/>}</button><a className="nav-contact" href={`${home ? '' : '/'}#contact`}>Let’s talk <ArrowUpRight size={15}/></a><button ref={trigger} className="icon-button menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div></div>{open && <nav id="mobile-nav" className="mobile-nav wrap" aria-label="Mobile navigation">{[...links, ['Contact', '#contact']].map(([name, href]) => <a key={name} onClick={() => setOpen(false)} href={`${home ? '' : '/'}${href}`}>{name}<ArrowUpRight size={18}/></a>)}</nav>}</header>;
}
