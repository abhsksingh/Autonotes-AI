import { motion } from 'framer-motion'
import { ArrowRight, Mic, Zap, FileText, CheckCircle } from 'lucide-react'

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      <header className="px-8 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center p-2 shadow-lg shadow-indigo-500/20">
            <Mic size={24} className="text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            AutoNotes AI
          </span>
        </div>
        <button 
          onClick={onGetStarted}
          className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all font-medium text-sm"
        >
          Go to Dashboard
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 z-10 text-center pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            <Zap size={16} />
            <span>Powered by OpenAI Whisper & GPT-4</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Meetings transcribed. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Summarized automatically.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Stop taking notes. Just upload your meeting audio and let our AI generate accurate transcripts, concise summaries, and actionable tasks in seconds.
          </p>
          
          <button 
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-indigo-600 rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="flex items-center gap-2 relative z-10">
              Get Started for Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-6"
        >
          <FeatureCard 
            icon={<Mic className="text-blue-400" />}
            title="Flawless Transcription"
            desc="Whisper-powered speech-to-text ensures every word is captured with near-perfect accuracy."
          />
          <FeatureCard 
            icon={<FileText className="text-indigo-400" />}
            title="Smart Summaries"
            desc="Instantly get the gist of hour-long meetings with structured, easy-to-read summaries."
          />
          <FeatureCard 
            icon={<CheckCircle className="text-emerald-400" />}
            title="Action Items Extracted"
            desc="AI identifies tasks, deadlines, and owners automatically so nothing falls through the cracks."
          />
        </motion.div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm text-left hover:border-slate-700 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
  )
}
