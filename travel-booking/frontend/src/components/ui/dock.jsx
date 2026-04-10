import React from 'react'
import { Activity, Users, Coffee, AlertTriangle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── SARA's 5 dashboard tabs only ── */
const SARA_TABS = [
  { id: 'lounge',   label: 'Lounge Traffic',     icon: Activity      },
  { id: 'staffing', label: 'Staffing',            icon: Users         },
  { id: 'food',     label: 'Food Optimization',   icon: Coffee        },
  { id: 'risk',     label: 'Risk Monitoring',     icon: AlertTriangle },
  { id: 'customer', label: 'Customer Experience', icon: Star          },
]

/* ── Single dock icon button ── */
function DockItem({ label, Icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'group relative grid h-12 w-12 place-items-center rounded-xl ring-1 backdrop-blur-xl shadow-lg',
        'transition-all duration-200 hover:-translate-y-1.5 hover:scale-[1.1]',
        isActive
          ? [
              'bg-gradient-to-b from-[#D4AF37]/25 to-[#D4AF37]/10',
              'ring-[#D4AF37]/50',
              'shadow-[0_0_22px_rgba(212,175,55,0.25)]',
            ]
          : [
              'bg-gradient-to-b from-neutral-800/60 to-neutral-900/70',
              'ring-white/[0.07]',
              'hover:ring-[#D4AF37]/30',
            ],
        'sm:h-14 sm:w-14'
      )}
    >
      {/* Icon */}
      <Icon
        className={cn(
          'h-5 w-5 transition-all duration-200 group-hover:scale-110',
          isActive ? 'text-[#D4AF37]' : 'text-white/55 group-hover:text-white/85'
        )}
        strokeWidth={2}
      />

      {/* Active indicator dot */}
      {isActive && (
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#D4AF37] shadow-[0_0_4px_#D4AF37]" />
      )}

      {/* Tooltip — appears above the icon */}
      <span
        className={cn(
          'pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap',
          'rounded-lg bg-[#0B1A2B]/95 px-2.5 py-1.5 text-[10px] font-medium text-[#E6C27A]',
          'ring-1 ring-[#D4AF37]/20',
          'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0',
          'transition-all duration-200'
        )}
      >
        {label}
        {/* Tooltip arrow */}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-[#0B1A2B]/95 ring-1 ring-[#D4AF37]/20" />
      </span>
    </button>
  )
}

/* ── Main exported dock ── */
export function SaraDock({ activeTab, setActiveTab }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none">
      {/* Outer glow */}
      <div className="absolute inset-0 -z-10 rounded-[36px] bg-[#D4AF37]/8 blur-2xl scale-110" />

      <div
        className={cn(
          'flex items-center gap-2 rounded-[28px] sm:rounded-[36px]',
          'bg-[#0B1A2B]/85 px-3 py-2.5 sm:px-5 sm:py-3',
          'shadow-[0_8px_48px_rgba(0,0,0,0.65)]',
          'ring-1 ring-[#D4AF37]/12',
          'backdrop-blur-2xl',
          'sm:gap-3'
        )}
      >
        {SARA_TABS.map(({ id, label, icon }) => (
          <DockItem
            key={id}
            label={label}
            Icon={icon}
            isActive={activeTab === id}
            onClick={() => setActiveTab(id)}
          />
        ))}
      </div>
    </div>
  )
}
