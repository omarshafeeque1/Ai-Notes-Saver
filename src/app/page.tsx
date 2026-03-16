'use client'

import { 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Zap, 
  Layout, 
  Star, 
  Brain, 
  Cpu, 
  Play, 
  CheckCircle, 
  Globe, 
  Command, 
  Layers, 
  Search as SearchIcon 
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/ScrollReveal'
import { TiltCard } from '@/components/TiltCard'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-purple-500/30 overflow-x-hidden relative bg-grid">
      <div className="mesh" />

      {/* Sticky Navbar */}
      <nav className="fixed top-0 inset-x-0 z-[100] glass-navbar">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-colors">
              <Command size={22} className="text-white group-hover:text-purple-400 transition-colors" />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
              NotesSaver
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Security'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-gray-400 hover:text-white transition-all relative group">
                {item}
                <motion.span 
                  className="absolute -bottom-1 left-0 w-0 h-px bg-purple-500 group-hover:w-full transition-all duration-300" 
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="px-6 py-2.5 bg-white text-black text-sm font-black rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-purple-500/20 btn-glow ring-4 ring-white/5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-48 px-6 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-10 shadow-inner">
            <motion.div 
               animate={{ scale: [1, 1.2, 1] }} 
               transition={{ duration: 2, repeat: Infinity }}
               className="w-1.5 h-1.5 bg-purple-500 rounded-full" 
            />
            Neural Intelligence Active
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="text-7xl md:text-9xl font-black tracking-tightest max-w-5xl mx-auto mb-8 leading-[0.9] text-glow">
            Your Thoughts, <br />
            <span className="text-white">Perfected by AI.</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            The intelligent sanctuary for your digital life. Capture, organize, and enhance your digital notes with world-class AI models. Developed for the next generation of thinkers.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-purple-600 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-purple-500 transition-all shadow-2xl shadow-purple-600/20 active:scale-[0.98] group">
              Get Started Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 glass rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/5 transition-all active:scale-[0.98]">
              <Play size={20} className="fill-white" />
              Watch Demo
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* Dashboard Preview Section */}
      <section className="px-6 py-20">
        <ScrollReveal delay={0.4}>
          <div className="relative group max-w-6xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative glass rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl shadow-black/80">
              {/* Mock Dashboard UI */}
              <div className="aspect-[16/9] w-full bg-[#050505] flex flex-col">
                <div className="h-16 border-b border-white/5 flex items-center px-8 gap-4 justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                   </div>
                   <div className="w-96 h-8 glass rounded-lg border border-white/5 flex items-center px-4 gap-2">
                       <SearchIcon size={14} className="text-gray-700" />
                      <div className="w-20 h-2 bg-white/5 rounded-full" />
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
                   </div>
                </div>
                
                <div className="flex-1 flex p-8 gap-8 overflow-hidden">
                   <div className="w-64 space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-10 rounded-xl glass border border-white/5 flex items-center px-4 gap-3 ${i === 1 ? 'border-purple-500/50 bg-purple-500/10' : ''}`}>
                           <div className={`w-4 h-4 rounded-md ${i === 1 ? 'bg-purple-500' : 'bg-white/10'}`} />
                           <div className="w-24 h-2 bg-white/5 rounded-full" />
                        </div>
                      ))}
                   </div>
                   <div className="flex-1 grid grid-cols-2 gap-6">
                      {[1, 2, 3, 4].map(i => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-8 rounded-3xl glass border border-white/5 space-y-4 relative group/card"
                        >
                           <div className="flex justify-between items-start">
                              <div className="w-32 h-4 bg-white/10 rounded-full" />
                              <Sparkles size={16} className="text-purple-500 animate-pulse" />
                           </div>
                           <div className="space-y-2">
                             <div className="w-full h-2 bg-white/5 rounded-full" />
                             <div className="w-[80%] h-2 bg-white/5 rounded-full" />
                             <div className="w-[90%] h-2 bg-white/5 rounded-full" />
                           </div>
                           <div className="pt-4 flex gap-2">
                              <div className="px-3 py-1 glass rounded-md text-[8px] font-bold text-gray-500">AI POLISHED</div>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-48 bg-[#000000]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Engineered for Excellence.</h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">A suite of powerful tools designed to optimize your cognitive workflow.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield size={24} className="text-purple-400" />}
              title="Vault Security"
              description="Enterprise-grade encryption protecting your most sensitive thoughts and ideas."
            />
            <FeatureCard 
              icon={<Zap size={24} className="text-blue-400" />}
              title="Hyper Speed"
              description="Built for velocity. Instant synchronization and search across all your digital devices."
            />
            <FeatureCard 
              icon={<Brain size={24} className="text-green-400" />}
              title="AI Synergy"
              description="Harness the power of Llama 3 to structure, polish, and expand your ideas."
            />
            <FeatureCard 
              icon={<Layers size={24} className="text-yellow-400" />}
              title="Smart Organization"
              description="Automatic tagging and categorization of notes based on neural content analysis."
            />
            <FeatureCard 
              icon={<Globe size={24} className="text-cyan-400" />}
              title="Real-Time Sync"
              description="Seamlessly bridge your workflow between desktop, tablet, and mobile platforms."
            />
            <FeatureCard 
              icon={<CheckCircle size={24} className="text-rose-400" />}
              title="AI Summaries"
              description="Condense complex ideas into actionable bullet points with one single click."
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto glass p-16 md:p-24 rounded-[4rem] text-center border border-white/5 shadow-3xl">
           <ScrollReveal>
             <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Ready to Evolve?</h2>
             <p className="text-xl text-gray-500 mb-12 font-medium">Join 50,000+ thinkers who have decentralized their memory to NotesSaver.</p>
             <Link href="/login" className="px-12 py-6 bg-white text-black rounded-3xl font-black text-xl hover:bg-gray-200 transition-all inline-flex items-center gap-3 shadow-2xl active:scale-95 shadow-purple-500/10">
                Join the Network
                <ArrowRight size={24} />
             </Link>
           </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-24 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 text-gray-500">
           <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-8">
                <Command size={24} className="text-white" />
                <span className="text-xl font-black text-white">NotesSaver</span>
              </div>
              <p className="font-medium text-sm leading-relaxed mb-8">The intelligent layer for human cognition. Built for the modern architect of ideas.</p>
              <div className="flex gap-4">
                 {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 glass rounded-lg border border-white/5 flex items-center justify-center hover:border-white/20 transition-colors cursor-pointer" />)}
              </div>
           </div>
           
           <div>
              <h4 className="text-white font-bold mb-8 uppercase text-[10px] tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm font-semibold">
                 <li className="hover:text-white transition-colors cursor-pointer">Features</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Security</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Roadmap</li>
              </ul>
           </div>

           <div>
              <h4 className="text-white font-bold mb-8 uppercase text-[10px] tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm font-semibold">
                 <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Privacy</li>
              </ul>
           </div>

           <div>
              <h4 className="text-white font-bold mb-8 uppercase text-[10px] tracking-widest">Contact</h4>
              <ul className="space-y-4 text-sm font-semibold">
                 <li className="hover:text-white transition-colors cursor-pointer">Support</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Discord</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Twitter</li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto pt-24 mt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-widest">
           <p>© 2026 NotesSaver. Design for the decentralized future.</p>
           <div className="flex gap-8">
              <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
           </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <ScrollReveal>
      <TiltCard className="h-full">
        <div className="p-10 rounded-[2.5rem] glass hover:bg-white/[0.04] transition-all group h-full relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-inner">
            {icon}
          </div>
          <h3 className="text-2xl font-black mb-4 group-hover:text-purple-400 transition-colors">{title}</h3>
          <p className="text-gray-500 font-bold leading-relaxed text-sm group-hover:text-gray-400 transition-colors">{description}</p>
          <div className="absolute bottom-4 right-10 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 group-hover:duration-500">
             <ArrowRight size={16} className="text-purple-500" />
          </div>
        </div>
      </TiltCard>
    </ScrollReveal>
  )
}
