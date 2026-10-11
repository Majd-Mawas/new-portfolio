import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ProjectVisual } from '@/components/system-visual';
import { projects } from '@/lib/content';
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const project = projects.find(p => p.slug === slug); return { title: project?.title ?? 'Project not found', description: project?.description, alternates: { canonical: `/work/${slug}` } }; }
export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const project = projects.find(p => p.slug === slug); if (!project) notFound();
  return <><Navigation home={false}/><main id="main-content" tabIndex={-1} className="wrap case-main"><a href="/#work" className="case-back"><ArrowLeft size={16}/>Back to selected work</a><header className="case-header"><span className="mono accent">{project.category} / {project.number}</span><h1>{project.title}<span className="accent">.</span></h1><p className="case-description">{project.description}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="case-meta"><span>{project.company}</span><span>{project.period}</span><span>Engineering case study</span></div></header><ProjectVisual type={project.visual}/><section className="case-body"><h2 style={{ fontSize: 27 }}>The challenge</h2><p>{project.challenge}</p></section><section className="case-body"><h2 style={{ fontSize: 27 }}>My contribution</h2><ul>{project.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></section>{project.result && <section className="case-result"><span className="mono accent">VERIFIED EXPERIENCE OUTCOME</span><p>{project.result}</p></section>}<p className="case-note">{project.note} The illustration above is a conceptual diagram, not a product screenshot.</p><div className="case-cta"><h3>Have a similar challenge?</h3><a className="button primary" href="/#contact">Let’s discuss your project <ArrowUpRight size={16}/></a></div></main><Footer/></>;
}

