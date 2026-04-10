import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceDot,
} from 'recharts'
import { TrendingUp, TrendingDown, Users, Clock, Brain, Zap, ArrowUpRight } from 'lucide-react'

/* ─── Reusable gold glassmorphism card ─── */
function GlassCard({ children, className = '' }) {
  return (
    <div
      className={`
        rounded-2xl border border-[#D4AF37]/15
        bg-gradient-to-b from-[#111111] to-[#0A0A0A]
        p-6 shadow-[0_4px_32px_rgba(0,0,0,0.45)]
        hover:border-[#D4AF37]/30
        hover:shadow-[0_4px_40px_rgba(212,175,55,0.08)]
        hover:scale-[1.01]
        transition-all duration-250
        ${className}
      `}
    >
      {children}
    </div>
  )
}

/* ─── Custom chart tooltip ─── */
function GoldTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-[#D4AF37]/25 bg-[#0B1A2B]/95 backdrop-blur-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
      <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-1">
        {payload[0].payload.hour}
      </p>
      <p className="text-2xl font-bold text-[#D4AF37]">{payload[0].value}</p>
      <p className="text-[10px] text-[#9CA3AF] mt-0.5">passengers</p>
    </div>
  )
}

/* ─── Main component ─── */
const LoungeTraffic = ({ data }) => {
  const { forecast } = data

  /* Derived metrics */
  const currentOccupancy  = Math.round(forecast[0])
  const peakOccupancy     = Math.round(Math.max(...forecast))
  const peakHourIndex     = forecast.indexOf(Math.max(...forecast))
  const avgOccupancy      = Math.round(forecast.reduce((a, b) => a + b, 0) / forecast.length)
  const trendUp           = forecast[forecast.length - 1] > forecast[0]
  const surgeProbability  = Math.min(Math.round((peakOccupancy / 300) * 100), 99)
  const staffRec          = surgeProbability > 60 ? '+20%' : '+10%'
  const capacityPct       = Math.round((currentOccupancy / 300) * 100)

  const chartData = forecast.map((val, i) => ({
    hour: `H${i + 1}`,
    customers: Math.round(val),
  }))

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5E6C4] tracking-tight">
            Lounge Traffic Forecast
          </h2>
          <p className="text-[#9CA3AF] text-sm mt-1">
            Real-time AI occupancy predictions · 6-hour window
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37] animate-pulse" />
          Updated just now
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Current Occupancy */}
        <GlassCard>
          <div className="flex items-start justify-between mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
              <Users className="size-4 text-[#D4AF37]" />
            </div>
            <span className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.12em] font-semibold">Live</span>
          </div>
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-semibold mb-2">
            Current Occupancy
          </p>
          <p className="text-5xl font-bold text-[#D4AF37] leading-none">{currentOccupancy}</p>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-[#9CA3AF]">passengers in lounge</p>
            <span className="text-xs font-semibold text-[#E6C27A]">{capacityPct}% full</span>
          </div>
          {/* Capacity bar */}
          <div className="mt-3 h-1 rounded-full bg-[#D4AF37]/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E6C27A] transition-all duration-700"
              style={{ width: `${capacityPct}%` }}
            />
          </div>
        </GlassCard>

        {/* Peak Prediction */}
        <GlassCard>
          <div className="flex items-start justify-between mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
              <TrendingUp className="size-4 text-[#D4AF37]" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trendUp
                ? <ArrowUpRight className="size-3" />
                : <TrendingDown className="size-3" />
              }
              {trendUp ? 'Rising' : 'Falling'}
            </div>
          </div>
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-semibold mb-2">
            Peak Prediction
          </p>
          <p className="text-5xl font-bold text-[#D4AF37] leading-none">{peakOccupancy}</p>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-[#9CA3AF]">at Hour {peakHourIndex + 1}</p>
            <span className="text-xs font-semibold text-[#E6C27A]">max load</span>
          </div>
          <div className="mt-3 h-1 rounded-full bg-[#D4AF37]/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E6C27A] transition-all duration-700"
              style={{ width: `${Math.min(Math.round((peakOccupancy / 300) * 100), 100)}%` }}
            />
          </div>
        </GlassCard>

        {/* Forecast Window */}
        <GlassCard>
          <div className="flex items-start justify-between mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
              <Clock className="size-4 text-[#D4AF37]" />
            </div>
            <span className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.12em] font-semibold">AI</span>
          </div>
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-semibold mb-2">
            Forecast Window
          </p>
          <p className="text-5xl font-bold text-[#D4AF37] leading-none">6h</p>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-[#9CA3AF]">avg {avgOccupancy} per hour</p>
            <span className="text-xs font-semibold text-[#E6C27A]">6 points</span>
          </div>
          <div className="mt-3 h-1 rounded-full bg-[#D4AF37]/10 overflow-hidden">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E6C27A]" />
          </div>
        </GlassCard>

      </div>

      {/* ── AI Insight Panel ── */}
      <div
        className="rounded-2xl bg-gradient-to-r from-[#D4AF37]/[0.07] to-transparent border border-[#D4AF37]/12 p-5 flex items-start gap-4"
        style={{ borderLeftWidth: '3px', borderLeftColor: '#D4AF37' }}
      >
        <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/25 flex items-center justify-center shrink-0 mt-0.5">
          <Brain className="size-4 text-[#D4AF37]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[10px] text-[#D4AF37] font-bold tracking-[0.18em] uppercase">AI Insight</p>
            <div className="flex items-center gap-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5">
              <Zap className="size-2.5 text-[#D4AF37]" />
              <span className="text-[9px] font-bold text-[#D4AF37]">LIVE</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-0.5">
              <p className="text-white font-semibold text-sm">⏰ Peak at Hour {peakHourIndex + 1}</p>
              <p className="text-[#9CA3AF] text-xs">Highest traffic window predicted</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-white font-semibold text-sm">📈 Surge Probability: {surgeProbability}%</p>
              <p className="text-[#9CA3AF] text-xs">Based on historical patterns</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-white font-semibold text-sm">👥 Staff Rec: {staffRec}</p>
              <p className="text-[#9CA3AF] text-xs">Recommended for peak window</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Forecast Chart ── */}
      <GlassCard className="!p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-lg">Hourly Customer Forecast</h3>
            <p className="text-[#9CA3AF] text-xs mt-0.5">AI-predicted passenger flow per hour</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <span className="inline-block w-8 h-[2px] rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E6C27A]" />
            Predicted
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 16, right: 16, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#D4AF37" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="lineGold" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#E6C27A" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(212,175,55,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<GoldTooltip />}
              cursor={{ stroke: 'rgba(212,175,55,0.15)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />

            <Area
              type="monotone"
              dataKey="customers"
              stroke="url(#lineGold)"
              strokeWidth={2.5}
              fill="url(#areaGold)"
              dot={false}
              activeDot={{
                r: 5,
                fill: '#D4AF37',
                stroke: '#0A0A0A',
                strokeWidth: 2,
                filter: 'url(#glow)',
              }}
            />

            {/* Peak marker */}
            <ReferenceDot
              x={`H${peakHourIndex + 1}`}
              y={peakOccupancy}
              r={6}
              fill="#D4AF37"
              stroke="#0A0A0A"
              strokeWidth={2}
              label={{
                value: 'PEAK',
                fill: '#D4AF37',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1,
                dy: -16,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>

    </div>
  )
}

export default LoungeTraffic
