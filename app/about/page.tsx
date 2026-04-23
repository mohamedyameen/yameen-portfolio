import type { Metadata } from 'next'
import { FadeUp } from '@/components/ui/FadeUp'

export const metadata: Metadata = {
  title: 'Info',
  description:
    'Mohamed Yameen — Lead Product Designer crafting B2B SaaS, AI-assisted experiences, and enterprise design systems.',
}

const skills = [
  {
    label: 'Design',
    body: 'End-to-end product design, interaction design, UI/UX, information architecture.',
  },
  {
    label: 'AI & Emerging Interfaces',
    body: 'Conversational UI, AI-assisted experiences, intelligent automation UX.',
  },
  {
    label: 'Design Systems',
    body: 'Enterprise systems (web & mobile), component libraries, design tokens.',
  },
  {
    label: 'Research',
    body: 'User interviews, usability testing, personas, journey mapping.',
  },
  {
    label: 'Tools',
    body: 'Figma, Framer, Cursor, Figma Make, Lovable.',
  },
]

const experience = [
  {
    role: 'Lead Product Designer (L3)',
    company: 'Facilio',
    period: 'Mar 2022 — Present · Chennai, India',
    summary:
      'B2B SaaS platform for connected facilities and operations management. Leads end-to-end product design from research and problem framing through interaction design, prototyping, and delivery.',
    bullets: [
      'Built and scaled the enterprise design system (web & mobile) with 100+ components — used across 10+ product teams, reducing design-to-dev handoff time by 35% and design debt by 40%.',
      'Mentors 4 designers through weekly critiques and 1:1s, raising craft quality and shipping velocity across the team.',
      'Partners closely with PMs and engineers in agile sprints, designing in parallel with and ahead of engineering delivery.',
      'Led design for Facilio Atom — the AI application platform — including the Service Desk Agent and Dispatcher Agent running in live customer environments.',
    ],
  },
]

const freelance = [
  {
    name: 'Mellow',
    period: 'Feb 2024',
    body: 'Conversational AI project management tool with integrated chat, file collaboration, and the Mellow AI assistant for intelligent prioritisation. Defined dark/light mode tokens and interaction patterns across 40+ screens.',
  },
  {
    name: 'Blue Whistle',
    period: 'Nov 2023',
    body: 'Parliamentary simulation platform for education — full UX across onboarding, debate flows, law proposals, and role-based interfaces.',
  },
  {
    name: 'Blubees',
    period: 'Jul 2023',
    body: 'Healthcare job-finder portal connecting medical institutions, professionals, agencies, and support workers.',
  },
]

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-10 py-6 border-t border-border first:border-t-0">
      <div className="text-xs uppercase tracking-wide text-muted-foreground pt-1">
        {label}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 md:px-10 py-10 md:py-16 flex flex-col gap-10">
      {/* Intro */}
      <FadeUp>
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Mohamed Yameen
        </h1>
        <p className="text-sm text-muted-foreground">
          Lead Product Designer (L3) · Chennai, India
        </p>
        <p className="text-sm md:text-base text-foreground/80 leading-relaxed max-w-[65ch]">
          Designing B2B SaaS products for 4+ years — spanning enterprise design
          systems, AI-assisted experiences, and complex workflow tools. Proven
          track record of shipping production design systems used across 10+
          product teams, launching AI agents in live customer environments, and
          reducing design-to-dev handoff time by 35%. Comfortable leading
          end-to-end design from research to delivery, and mentoring designers
          to raise team craft.
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
          <a href="mailto:mohamedyameen1999@gmail.com" className="hover:text-foreground transition-colors">
            mohamedyameen1999@gmail.com
          </a>
          <span>·</span>
          <a href="tel:+919940677476" className="hover:text-foreground transition-colors">
            +91 99406 77476
          </a>
          <span>·</span>
          <a
            href="https://linkedin.com/in/mohamed-yameen-83681315a"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </section>

      </FadeUp>

      {/* Skills */}
      <FadeUp delay={0.1}>
      <section>
        <Row label="Skills">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {skills.map(({ label, body }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="text-sm text-muted-foreground leading-relaxed">{body}</span>
              </div>
            ))}
          </div>
        </Row>

        {/* Experience */}
        <Row label="Experience">
          {experience.map((job) => (
            <div key={job.company} className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {job.role} · {job.company}
                </span>
                <span className="text-xs text-muted-foreground">{job.period}</span>
              </div>
              <p className="text-sm text-foreground/75 leading-relaxed max-w-[65ch]">
                {job.summary}
              </p>
              <ul className="flex flex-col gap-2 list-disc pl-4 text-sm text-foreground/75 leading-relaxed max-w-[65ch]">
                {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </Row>

        {/* Freelance */}
        <Row label="Freelance">
          {freelance.map(p => (
            <div key={p.name} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-foreground">{p.name}</span>
                <span className="text-xs text-muted-foreground">· {p.period}</span>
              </div>
              <p className="text-sm text-foreground/75 leading-relaxed max-w-[65ch]">
                {p.body}
              </p>
            </div>
          ))}
        </Row>

        {/* Education */}
        <Row label="Education">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              B.E. Computer Science & Engineering
            </span>
            <span className="text-xs text-muted-foreground">
              Aalim Muhammed Salegh College of Engineering · 2017 – 2021
            </span>
          </div>
        </Row>

        {/* Languages */}
        <Row label="Languages">
          <p className="text-sm text-foreground/75">English · Tamil</p>
        </Row>
      </section>
      </FadeUp>
    </div>
  )
}
