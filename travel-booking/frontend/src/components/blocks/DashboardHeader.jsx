import React, { useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Minimal fixed top bar for the dashboard view.
 * Navigation is handled by SaraDock (bottom dock).
 */
export function DashboardHeader({ onBackToLanding }) {
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
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToLanding}
                title="Back to Home"
                className="text-[#9CA3AF] hover:text-[#D4AF37] transition-colors p-1 rounded-lg hover:bg-[#D4AF37]/8"
              >
                <ChevronLeft className="size-5" />
              </button>
              <img src="/nav-logo.png" alt="SARA" className="h-9 w-auto object-contain" />
            </div>

            {/* Right: live pulsing indicator */}
            <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/6 px-3 py-1.5">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-[#D4AF37]" />
              </span>
              <span className="text-xs font-semibold text-[#D4AF37]">Live</span>
            </div>

          </div>
        </div>
      </nav>
    </header>
  )
}
