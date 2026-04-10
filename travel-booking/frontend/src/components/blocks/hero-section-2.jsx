import React from 'react'
import { ChevronRight, Menu, X, Activity, Users, Coffee, AlertTriangle, Star, Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import { useScroll } from 'framer-motion'

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

// SARA tabs replacing the generic nav links
const tabs = [
  { id: 'lounge',    label: 'Lounge Traffic',      icon: Activity  },
  { id: 'staffing',  label: 'Staffing',             icon: Users     },
  { id: 'food',      label: 'Food Optimization',    icon: Coffee    },
  { id: 'risk',      label: 'Risk Monitoring',      icon: AlertTriangle },
  { id: 'customer',  label: 'Customer Experience',  icon: Star      },
]

export function HeroSection({ activeTab, setActiveTab }) {
  return (
    <>
      <HeroHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="overflow-hidden">
        {/* Hero intro shown only on "lounge" tab (the default landing) */}
        <section>
          <div className="relative pt-24">
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,hsl(var(--background))_75%)]" />
            <div className="mx-auto max-w-5xl px-6">
              <div className="sm:mx-auto lg:mr-auto">
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.3,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                >
                  <div className="flex items-center gap-3 mt-8 lg:mt-16">
                    <img src="/hero-logo.png" alt="SARA Logo" className="h-14 w-auto object-contain" />
                    <span className="text-sm font-semibold tracking-widest uppercase text-cyan-400 opacity-80">
                      Smart Airport Resource Allocator
                    </span>
                  </div>

                  <h1 className="mt-4 max-w-2xl text-balance text-5xl font-medium md:text-6xl text-foreground">
                    Smarter Lounges,{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                      Effortless Operations
                    </span>
                  </h1>
                  <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
                    Real-time occupancy forecasting and AI-driven resource optimization for
                    airport lounges — staffing, food, and risk at a glance.
                  </p>

                  <div className="mt-10 flex flex-wrap items-center gap-3">
                    <div className="bg-foreground/10 rounded-[14px] border border-border p-0.5">
                      <Button
                        size="lg"
                        className="rounded-xl px-5 text-base bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold"
                        onClick={() => setActiveTab('lounge')}
                      >
                        <span className="text-nowrap">View Lounge Traffic</span>
                      </Button>
                    </div>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="h-[42px] rounded-xl px-5 text-base text-muted-foreground hover:text-foreground"
                      onClick={() => setActiveTab('risk')}
                    >
                      <span className="text-nowrap">Risk Monitor</span>
                    </Button>
                  </div>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.5 },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-16">
                <div
                  aria-hidden
                  className="absolute inset-0 z-10 from-transparent from-35% bg-gradient-to-b to-background"
                />
                <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-background/60 p-4 shadow-lg shadow-cyan-950/30 ring-1 ring-white/5">
                  <img
                    className="aspect-[15/8] relative rounded-2xl w-full object-cover"
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=2700&q=80"
                    alt="Airport lounge overview"
                    width="2700"
                    height="1440"
                  />
                  {/* Stats overlay */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-wrap gap-3">
                    <StatPill label="Occupancy" value="78%" color="cyan" />
                    <StatPill label="Staff On-Duty" value="12" color="blue" />
                    <StatPill label="Food Units" value="248" color="emerald" />
                    <StatPill label="Risk Level" value="Low" color="green" />
                  </div>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        {/* Airline logos trust section */}
        <section className="bg-background pb-16 pt-12 md:pb-24">
          <div className="group relative m-auto max-w-5xl px-6">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              Trusted by leading airports
            </p>
            <div className="mx-auto mt-6 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-14 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
              {[
                { src: 'https://html.tailus.io/blocks/customers/nvidia.svg',   alt: 'Nvidia',   h: 'h-5' },
                { src: 'https://html.tailus.io/blocks/customers/github.svg',   alt: 'GitHub',   h: 'h-4' },
                { src: 'https://html.tailus.io/blocks/customers/nike.svg',     alt: 'Nike',     h: 'h-5' },
                { src: 'https://html.tailus.io/blocks/customers/openai.svg',   alt: 'OpenAI',   h: 'h-6' },
                { src: 'https://html.tailus.io/blocks/customers/laravel.svg',  alt: 'Laravel',  h: 'h-4' },
                { src: 'https://html.tailus.io/blocks/customers/lilly.svg',    alt: 'Lilly',    h: 'h-7' },
                { src: 'https://html.tailus.io/blocks/customers/column.svg',   alt: 'Column',   h: 'h-4' },
                { src: 'https://html.tailus.io/blocks/customers/lemonsqueezy.svg', alt: 'LemonSqueezy', h: 'h-5' },
              ].map(({ src, alt, h }) => (
                <div key={alt} className="flex">
                  <img className={`mx-auto ${h} w-fit invert`} src={src} alt={`${alt} Logo`} height="20" width="auto" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

// Small inline stat pill shown over the hero image
function StatPill({ label, value, color }) {
  const colors = {
    cyan:    'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
    blue:    'bg-blue-500/20 border-blue-500/40 text-blue-300',
    emerald: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    green:   'bg-green-500/20 border-green-500/40 text-green-300',
  }
  return (
    <div className={cn('flex items-center gap-2 rounded-lg border px-3 py-1.5 backdrop-blur-sm text-sm font-semibold', colors[color])}>
      <span className="text-xs opacity-70">{label}</span>
      <span>{value}</span>
    </div>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────

export const HeroHeader = ({ activeTab, setActiveTab }) => {
  const [menuState, setMenuState] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  const { scrollYProgress } = useScroll()

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrolled(latest > 0.02)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <header>
      <nav
        data-state={menuState ? 'active' : undefined}
        className={cn(
          'group fixed z-20 w-full border-b border-border/40 transition-colors duration-150',
          scrolled && 'bg-background/80 backdrop-blur-xl border-border/60',
        )}
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">

            {/* Left: logo + mobile menu toggle */}
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <a href="/" aria-label="home" className="flex items-center gap-3">
                <img src="/nav-logo.png" alt="SARA Logo" className="h-9 w-auto object-contain" />
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200 text-foreground" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 text-foreground" />
              </button>

              {/* Desktop tab nav */}
              <div className="hidden lg:block">
                <ul className="flex gap-1 text-sm">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                            activeTab === tab.id
                              ? 'bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                          )}
                        >
                          <Icon className="size-3.5" />
                          {tab.label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

            {/* Right: live status badge */}
            <div className={cn(
              'bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-border p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none',
            )}>
              {/* Mobile: tab list repeated */}
              <div className="lg:hidden w-full">
                <ul className="space-y-3 text-base">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => { setActiveTab(tab.id); setMenuState(false) }}
                          className={cn(
                            'flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                            activeTab === tab.id
                              ? 'bg-cyan-500/15 text-cyan-400'
                              : 'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          <Icon className="size-4" />
                          {tab.label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>


            </div>

          </div>
        </div>
      </nav>
    </header>
  )
}


