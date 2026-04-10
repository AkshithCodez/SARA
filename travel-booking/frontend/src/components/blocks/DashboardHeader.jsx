import React, { useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Activity, Users, Coffee, AlertTriangle, Star, Menu, X, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'lounge',   label: 'Lounge Traffic',     icon: Activity      },
  { id: 'staffing', label: 'Staffing',            icon: Users         },
  { id: 'food',     label: 'Food Optimization',   icon: Coffee        },
  { id: 'risk',     label: 'Risk Monitoring',     icon: AlertTriangle },
  { id: 'customer', label: 'Customer Experience', icon: Star          },
]

export function DashboardHeader({ activeTab, setActiveTab, onBackToLanding }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()

  React.useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => setScrolled(v > 0.01))
    return unsub
  }, [scrollYProgress])

  return (
    <header>
      <nav
        className={cn(
          'fixed top-0 z-50 w-full border-b transition-all duration-200',
          scrolled
            ? 'bg-[#0A0A0A]/92 backdrop-blur-xl border-[#D4AF37]/15'
            : 'bg-[#0B1A2B] border-[#D4AF37]/8'
        )}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4 py-3">

            {/* Left: back chevron + logo */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onBackToLanding}
                title="Back to Home"
                className="text-[#9CA3AF] hover:text-[#D4AF37] transition-colors p-1 rounded-lg hover:bg-[#D4AF37]/8"
              >
                <ChevronLeft className="size-5" />
              </button>
              <img src="/nav-logo.png" alt="SARA" className="h-9 w-auto object-contain" />
            </div>

            {/* Centre: desktop tabs */}
            <ul className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {tabs.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap',
                      activeTab === id
                        ? 'bg-[#D4AF37]/12 text-[#D4AF37] border border-[#D4AF37]/28 shadow-[0_0_18px_rgba(212,175,55,0.14)]'
                        : 'text-[#9CA3AF] hover:text-white hover:bg-white/5 border border-transparent'
                    )}
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Right: live badge + hamburger */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/6 px-3 py-1.5">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-[#D4AF37]" />
                </span>
                <span className="text-xs font-semibold text-[#D4AF37]">Live</span>
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#9CA3AF] hover:text-white p-1"
              >
                {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden border-t border-[#D4AF37]/10 py-3 pb-5"
            >
              <ul className="space-y-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <button
                      onClick={() => { setActiveTab(id); setMenuOpen(false) }}
                      className={cn(
                        'flex w-full items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                        activeTab === id
                          ? 'bg-[#D4AF37]/12 text-[#D4AF37] border border-[#D4AF37]/25'
                          : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </nav>
    </header>
  )
}
