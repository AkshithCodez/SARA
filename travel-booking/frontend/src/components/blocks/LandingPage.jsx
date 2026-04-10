import React from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Zap, Users, ChevronRight, ArrowRight, Plane } from 'lucide-react'

const features = [
  {
    icon: BarChart2,
    title: 'Real-time Predictions',
    desc: 'AI-powered occupancy forecasting with 94% accuracy across all peak windows, updated every 30 seconds.',
  },
  {
    icon: Zap,
    title: 'AI-driven Insights',
    desc: 'Deep learning models trained on historical passenger data surface actionable intelligence before crowds form.',
  },
  {
    icon: Users,
    title: 'Smart Resource Allocation',
    desc: 'Automatically optimise staff, food, and amenity deployment based on live predictions and confidence scores.',
  },
]

const stats = [
  ['94%', 'Prediction Accuracy'],
  ['6h',  'Forecast Window'],
  ['< 2s', 'Response Time'],
  ['50+', 'Airports Supported'],
]

/* ─── Subtle animated flight-path SVG ─── */
function FlightPath() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0" />
          <stop offset="50%"  stopColor="#D4AF37" stopOpacity="1" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Arced flight paths */}
      <path
        d="M -100 300 Q 400 80 900 350 Q 1200 500 1600 200"
        stroke="url(#pathGrad)" strokeWidth="1" fill="none" strokeDasharray="8 12"
        style={{ animation: 'dash 6s linear infinite' }}
      />
      <path
        d="M -50 500 Q 350 250 750 450 Q 1100 620 1500 350"
        stroke="url(#pathGrad)" strokeWidth="0.6" fill="none" strokeDasharray="6 16"
        style={{ animation: 'dash 9s linear infinite reverse' }}
      />
      <style>{`@keyframes dash { to { stroke-dashoffset: -200; } }`}</style>
    </svg>
  )
}

/* ─── Main export ─── */
export function LandingPage({ onEnterDashboard }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#D4AF37]/10 bg-[#0A0A0A]/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src="/nav-logo.png" alt="SARA" className="h-9 w-auto object-contain" />

          <div className="hidden md:flex items-center gap-8 text-sm text-[#9CA3AF]">
            <a href="#features" className="hover:text-[#D4AF37] transition-colors duration-200">Features</a>
            <a href="#stats"    className="hover:text-[#D4AF37] transition-colors duration-200">Analytics</a>
            <a href="#about"    className="hover:text-[#D4AF37] transition-colors duration-200">About</a>
          </div>

          <button
            onClick={onEnterDashboard}
            className="flex items-center gap-2 rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/20 hover:shadow-[0_0_24px_rgba(212,175,55,0.25)] transition-all duration-300"
          >
            Open Dashboard <ChevronRight className="size-4" />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-12">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1A2B] via-[#0A0A0A] to-[#0A0A0A] -z-20" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '52px 52px' }}
        />

        {/* Gold radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#D4AF37]/6 blur-[130px] -z-10" />

        {/* Animated flight paths */}
        <FlightPath />

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="max-w-3xl w-full"
        >
          {/* SARA hero logo */}
          <motion.img
            src="/hero-logo.png"
            alt="SARA"
            className="h-28 md:h-36 w-auto object-contain mx-auto mb-10 drop-shadow-[0_0_40px_rgba(212,175,55,0.35)]"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Eyebrow */}
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#D4AF37]/70 mb-5">
            AI-Powered Airport Intelligence
          </p>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            <span className="text-white">Smart</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E6C27A]">Airport</span>
            <br />
            <span className="text-white">Resource</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6C27A] to-[#F5E6C4]">Analytics</span>
          </h1>

          {/* Tagline */}
          <p className="text-[#9CA3AF] text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed font-light">
            Predict. Optimize. Elevate Lounge Experience.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onEnterDashboard}
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C27A] text-[#0A0A0A] font-bold text-base hover:shadow-[0_0_45px_rgba(212,175,55,0.45)] hover:scale-[1.03] transition-all duration-300"
            >
              Enter Dashboard
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <a
              href="#features"
              className="flex items-center justify-center px-8 py-4 rounded-xl border border-[#D4AF37]/25 text-[#D4AF37] font-semibold text-base hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all duration-300"
            >
              Explore Features
            </a>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-[#9CA3AF]/40 text-xs"
        >
          <Plane className="size-4 rotate-90 text-[#D4AF37]/30 animate-bounce" />
          <span>Scroll to explore</span>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Built for Premium International Airports</h2>
            <p className="text-[#9CA3AF] mt-4 max-w-xl mx-auto text-base leading-relaxed">
              Every feature is designed around the operational demands of high-traffic aviation environments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="group rounded-2xl border border-[#D4AF37]/12 bg-gradient-to-b from-[#0B1A2B]/80 to-[#0A0A0A]/60 backdrop-blur-sm p-8 hover:border-[#D4AF37]/35 hover:bg-[#D4AF37]/4 hover:shadow-[0_8px_48px_rgba(212,175,55,0.09)] transition-all duration-350"
              >
                <div className="w-12 h-12 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:border-[#D4AF37]/50 group-hover:bg-[#D4AF37]/15 transition-all duration-300">
                  <f.icon className="size-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{f.title}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section id="stats" className="py-16 px-6 border-y border-[#D4AF37]/8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map(([val, label], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E6C27A]">
                {val}
              </p>
              <p className="text-[#9CA3AF] text-sm mt-2">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── About / CTA ── */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase mb-3">About SARA</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            The Intelligence Layer Your Lounge Has Been Missing
          </h2>
          <p className="text-[#9CA3AF] text-base leading-relaxed mb-10">
            SARA integrates seamlessly with your existing airport systems, learning from historical
            passenger flows to deliver precise, actionable forecasts — so your team is always
            one step ahead of demand.
          </p>
          <button
            onClick={onEnterDashboard}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C27A] text-[#0A0A0A] font-bold text-base hover:shadow-[0_0_45px_rgba(212,175,55,0.4)] hover:scale-[1.03] transition-all duration-300"
          >
            Launch Dashboard
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="pb-10 px-6 border-t border-[#D4AF37]/8">
        <div className="max-w-5xl mx-auto pt-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <img src="/nav-logo.png" alt="SARA" className="h-7 w-auto object-contain opacity-60" />
          <p className="text-[#9CA3AF]/40 text-xs text-center">
            © 2025 SARA — Smart Airport Resource Analytics. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-[#9CA3AF]/40">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
