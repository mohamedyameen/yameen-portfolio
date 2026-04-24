import { projects } from '@/content/projects'
import { MasonryGrid } from '@/components/works/MasonryGrid'
import { FadeUp } from '@/components/ui/FadeUp'
import DotFieldWrapper from '@/components/home/DotFieldWrapper'
import { BrandMarquee } from '@/components/home/BrandMarquee'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-border min-h-[260px] md:min-h-[320px]">

        {/* Left — text */}
        <div className="flex flex-col justify-center gap-5 px-5 md:px-10 py-12 md:py-16 border-b border-border md:border-b-0 md:border-r md:border-border">
          <FadeUp delay={0}>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              Lead Product Designer · Chennai, India
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground leading-[1.2] max-w-lg">
              Designing{' '}
              <em style={{ fontFamily: 'var(--font-playfair)' }} className="font-bold not-italic text-gray-400 hover:text-rose-400 transition-colors duration-300 cursor-default">
                complex
              </em>{' '}
              products,
              <br />
              crafting{' '}
              <em style={{ fontFamily: 'var(--font-playfair)' }} className="italic font-bold text-gray-400 hover:text-emerald-400 transition-colors duration-300 cursor-default">
                intuitive
              </em>{' '}
              experiences,
              <br />
              building{' '}
              <em style={{ fontFamily: 'var(--font-playfair)' }} className="italic font-bold text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-default">
                systems
              </em>{' '}
              that scale.
            </h1>
          </FadeUp>

          <FadeUp delay={0.16}>
            <p className="text-sm text-foreground/50 max-w-sm leading-relaxed">
              4+ years shipping B2B SaaS products — AI agents, omnichannel support tools, and enterprise design systems across 10+ teams. Leading design at Facilio, taking freelance projects in between.
            </p>
          </FadeUp>
        </div>

        {/* Right — game */}
        <div className="relative hidden md:block h-full min-h-[320px]">
          <DotFieldWrapper />
        </div>
      </section>

      {/* Brand marquee */}
      <BrandMarquee />

      {/* Grid */}
      <section id="works" className="scroll-mt-16">
        <MasonryGrid projects={projects} />
      </section>
    </>
  )
}
