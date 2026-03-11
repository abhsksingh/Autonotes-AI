import { useState, useEffect } from 'react'
import { ArrowLeft, Download, FileText, ListTodo, Lightbulb, MessageSquare, Edit3, Save } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard({ meetingId, onBack }) {
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('summary') // summary, transcript

  useEffect(() => {
    // Mock fetching meeting details
    setTimeout(() => {
      setMeeting({
        id: meetingId || 1,
        title: "Q3 Roadmapping Session",
        date: "2023-10-15T10:00:00Z",
        summary: "The team discussed the upcoming Q3 product roadmap. The main focus will be on improving the AI Meeting Notes Automation tool. Sarah proposed adding a calendar integration, which was highly supported. John highlighted some performance bottlenecks in the whisper transcription pipeline that need addressing immediately. It was decided that V1 release date will be pushed back by one week to ensure quality.",
        action_items: [
          { id: 1, text: "Investigate Whisper pipeline performance bottlenecks", owner: "John", status: "pending" },
          { id: 2, text: "Draft spec for Google Calendar integration", owner: "Sarah", status: "pending" },
          { id: 3, text: "Update public roadmap with new V1 release date", owner: "Alex", status: "completed" },
        ],
        decisions: [
          "Focus Q3 strictly on AI Meeting Tool enhancements.",
          "Push V1 release date back by exactly one week.",
          "Prioritize Calendar integration over Zoom bot for now."
        ],
        transcript: "Sarah: Alright, let's get started with the Q3 roadmap. First up is the AI meeting tool.\nJohn: Before we go too far, we've got some serious performance issues with the whisper API wrapper we wrote. It's slowing down processing by 30%.\nSarah: Okay, John, I need you to lead the investigation on that. It's critical.\nJohn: You got it.\nAlex: I think we need to push the V1 release back if we're fixing pipeline issues.\nSarah: I agree. Let's push it by one week. Also, I've had feedback that calendar integration is a must-have.\nAlex: I can handle the frontend work, but we need a spec.\nSarah: I'll draft the spec for the calendar integration by Friday."
      })
      setLoading(false)
    }, 800)
  }, [meetingId])

  const handleExport = () => {
    alert("Export functionality will generate a PDF/Markdown of these notes.")
  }

  if (loading || !meeting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto w-full pt-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {meeting.title}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Processed on {new Date(meeting.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isEditing 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {isEditing ? (
              <><Save size={18} /> Save Changes</>
            ) : (
              <><Edit3 size={18} /> Edit Notes</>
            )}
          </button>
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button 
              onClick={() => setActiveTab('summary')}
              className={`pb-3 px-4 font-medium transition-all relative ${activeTab === 'summary' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Executive Summary
              {activeTab === 'summary' && (
                <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-indigo-500" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('transcript')}
              className={`pb-3 px-4 font-medium transition-all relative ${activeTab === 'transcript' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Full Transcript
              {activeTab === 'transcript' && (
                <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-indigo-500" />
              )}
            </button>
          </div>

          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm"
          >
            {activeTab === 'summary' ? (
              <div>
                <div className="flex items-center gap-3 mb-6 text-indigo-400">
                  <FileText size={24} />
                  <h2 className="text-xl font-bold text-white">AI Summary</h2>
                </div>
                {isEditing ? (
                  <textarea 
                    className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-indigo-500"
                    defaultValue={meeting.summary}
                  />
                ) : (
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {meeting.summary}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6 text-indigo-400">
                  <MessageSquare size={24} />
                  <h2 className="text-xl font-bold text-white">Transcript Details</h2>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                  {meeting.transcript.split('\n').map((line, idx) => {
                    const [speaker, text] = line.split(': ');
                    return (
                      <div key={idx} className="bg-slate-800/30 rounded-2xl p-4 border border-slate-800/50">
                        <span className="inline-block px-2.5 py-1 bg-slate-800 text-xs font-bold text-slate-300 rounded-md mb-2">
                          {speaker}
                        </span>
                        <p className="text-slate-300 leading-relaxed">{text}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-6">
          
          {/* Action Items */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 text-rose-400">
              <ListTodo size={22} />
              <h2 className="text-lg font-bold text-white">Action Items</h2>
            </div>
            <div className="space-y-3">
              {meeting.action_items.map(item => (
                <div key={item.id} className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl p-4 flex gap-4 transition-colors">
                  <div className="mt-0.5">
                    <input type="checkbox" defaultChecked={item.status === 'completed'} className="w-5 h-5 rounded border-slate-600 bg-slate-900 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                  </div>
                  <div>
                    <p className={`text-sm mb-2 ${item.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {item.text}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                        {item.owner[0]}
                      </div>
                      <span className="text-slate-400">{item.owner}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {isEditing && (
              <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-300 border border-slate-700 border-dashed transition-colors">
                + Add Task
              </button>
            )}
          </div>

          {/* Key Decisions */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 text-amber-400">
              <Lightbulb size={22} />
              <h2 className="text-lg font-bold text-white">Key Decisions</h2>
            </div>
            <ul className="space-y-3">
              {meeting.decisions.map((decision, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-300 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{decision}</span>
                </li>
              ))}
            </ul>
             {isEditing && (
              <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-300 border border-slate-700 border-dashed transition-colors">
                + Add Decision
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
