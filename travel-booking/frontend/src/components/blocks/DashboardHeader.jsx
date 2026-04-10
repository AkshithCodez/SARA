import React, { useState } from 'react'
import { useScroll } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SaraDock } from '@/components/ui/dock'

/**
 * Two-row fixed header:
 *   Row 1 — logo + back button + live indicator
 *   Row 2 — SARA navigation tabs (dock moved to top)
 */
export function DashboardHeader({ activeTab, setActiveTab, onBackToLanding }) {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()

  React.useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => setScrolled(v > 0.005))
    return unsub
  }, [scrollYProgress])

  const baseStyle = 'fixed top-0 z-50 w-full transition-all duration-200'
  const bgStyle = scrolled
    ? 'bg-[#0A0A0A]/94 backdrop-blur-xl'
    : 'bg-[#0A0A0A]'

  return (
    <header className={cn(baseStyle, bgStyle)}>

      {/* ── Row 1: Logo + Live ── */}
      <div className="border-b border-[#D4AF37]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              title="Back to Home"
              className="text-[#9CA3AF] hover:text-[#D4AF37] transition-colors p-1.5 rounded-lg hover:bg-[#D4AF37]/8"
            >
              <ChevronLeft className="size-5" />
            </button>
            <img src="/nav-logo.png" alt="SARA" className="h-9 w-auto object-contain" />
          </div>

          {/* Live badge */}
          <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/6 px-3 py-1.5">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-[#D4AF37]" />
            </span>
            <span className="text-xs font-semibold text-[#D4AF37]">Live</span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Navigation tabs ── */}
      <div className="border-b border-[#D4AF37]/8 bg-[#0A0A0A]/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SaraDock activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

    </header>
  )
}
