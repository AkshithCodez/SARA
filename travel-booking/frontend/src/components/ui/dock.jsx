import React from 'react'
import { Activity, Users, Coffee, AlertTriangle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const SARA_TABS = [
  { id: 'lounge',   label: 'Lounge Traffic',     icon: Activity      },
  { id: 'staffing', label: 'Staffing',            icon: Users         },
  { id: 'food',     label: 'Food Optimization',   icon: Coffee        },
  { id: 'risk',     label: 'Risk Monitoring',     icon: AlertTriangle },
  { id: 'customer', label: 'Customer Experience', icon: Star          },
]

function DockItem({ label, Icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'relative group flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium',
        'transition-all duration-200',
        isActive
          ? [
              'bg-[#D4AF37]/12 text-[#D4AF37]',
              'ring-1 ring-[#D4AF37]/30',
              'shadow-[0_0_18px_rgba(212,175,55,0.14)]',
            ]
          : [
              'text-[#9CA3AF] hover:text-white',
              'hover:bg-white/[0.04]',
              'ring-1 ring-transparent',
            ]
      )}
    >
      <Icon
        className={cn(
          'size-4 shrink-0 transition-colors duration-200',
          isActive ? 'text-[#D4AF37]' : 'text-[#9CA3AF] group-hover:text-white/80'
        )}
        strokeWidth={2}
      />
      <span className="hidden md:inline whitespace-nowrap">{label}</span>

      {/* Active underline */}
      {isActive && (
        <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-[#D4AF37]" />
      )}
    </button>
  )
}

/** Inline tab strip — used inside DashboardHeader (not fixed bottom) */
export function SaraDock({ activeTab, setActiveTab }) {
  return (
    <div className="flex items-center justify-center gap-1 flex-wrap py-2">
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
  )
}
