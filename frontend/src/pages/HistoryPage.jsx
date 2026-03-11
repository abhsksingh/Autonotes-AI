import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileAudio, Calendar, Clock, ChevronRight, Search } from 'lucide-react'
import axios from 'axios'

export default function HistoryPage({ onMeetingSelect }) {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    // In a real scenario, this would fetch from backend
    // Since backend isn't fully wired with DB, using mock data for UI visual completion
    setTimeout(() => {
      setMeetings([
        { id: 1, title: 'Q3 Roadmapping Session', date: '2023-10-15T10:00:00Z', duration: 3600, filename: 'q3_roadmap.mp3' },
        { id: 2, title: 'Weekly Sync with Engineering', date: '2023-10-12T14:30:00Z', duration: 1800, filename: 'eng_sync.wav' },
        { id: 3, title: 'Client Pitch: Acme Corp', date: '2023-10-10T09:15:00Z', duration: 2700, filename: 'acme_pitch.mp3' },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) || 
    m.filename.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-6xl mx-auto w-full pt-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meeting History</h1>
          <p className="text-slate-400">View and manage all your processed meeting notes</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search meetings..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-slate-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 border-dashed">
          <FileAudio className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-medium text-slate-300 mb-2">No meetings found</h3>
          <p className="text-slate-500">We couldn't find any meetings matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMeetings.map((meeting, idx) => (
            <motion.div 
              key={meeting.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onMeetingSelect(meeting.id)}
              className="group bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 flex items-center justify-center text-slate-400 transition-colors">
                  <FileAudio size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-1.5 transition-colors">{meeting.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                      <Calendar size={14} />
                      {new Date(meeting.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                      <Clock size={14} />
                      {Math.round(meeting.duration / 60)} mins
                    </span>
                    <span className="hidden sm:inline-block text-slate-600 truncate max-w-[150px]">
                      {meeting.filename}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all group-hover:translate-x-1">
                <ChevronRight size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
