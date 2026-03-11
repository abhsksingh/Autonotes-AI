import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, FileAudio, Check, Loader2 } from 'lucide-react'
import axios from 'axios'

export default function UploadPage({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle, uploading, transcribing, summarizing, done
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleFileSelection = (selectedFile) => {
    if (selectedFile.type.startsWith('audio/') || selectedFile.name.match(/\.(mp3|wav|m4a)$/i)) {
      setFile(selectedFile)
    } else {
      alert("Please upload an audio file (.mp3, .wav, .m4a)")
    }
  }

  const handleProcess = async () => {
    if (!file) return

    try {
      setStatus('uploading')
      
      const formData = new FormData()
      formData.append('file', file)

      // Fake progress for UI demo since real API isn't connected yet
      setTimeout(() => setStatus('transcribing'), 1500)
      setTimeout(() => setStatus('summarizing'), 3500)
      
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setStatus('done')
      setTimeout(() => {
        onUploadComplete(response.data.id || 1) // Provide mock ID if needed
      }, 1000)

    } catch (error) {
      console.error("Upload failed", error)
      alert("Failed to process meeting audio. Is the backend running?")
      setStatus('idle')
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto w-full pt-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Upload Meeting Audio</h1>
        <p className="text-slate-400">Supported formats: MP3, WAV, M4A up to 50MB</p>
      </div>

      <div 
        className={`w-full relative rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-12 min-h-[400px] ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-500/5' 
            : file ? 'border-slate-700 bg-slate-800/20' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="audio/*,.mp3,.wav,.m4a"
          onChange={(e) => handleFileSelection(e.target.files[0])}
        />

        {!file && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center pointer-events-none"
          >
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <UploadCloud size={40} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Click or drag audio file here</h3>
            <p className="text-slate-400 text-sm max-w-xs">
              OpenAI Whisper will automatically transcribe your file once uploaded
            </p>
          </motion.div>
        )}

        {file && status === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center w-full max-w-md"
          >
            <div className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 flex items-center gap-4 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                <FileAudio size={24} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1 text-left">
                <p className="text-slate-200 font-medium truncate">{file.name}</p>
                <p className="text-slate-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="text-slate-400 hover:text-white px-3 py-1 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm transition-colors"
              >
                Change
              </button>
            </div>
            
            <button 
              onClick={handleProcess}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
            >
              Generate AI Notes
            </button>
          </motion.div>
        )}

        {file && status !== 'idle' && (
          <div className="flex flex-col items-center w-full max-w-md">
            <div className="space-y-6 w-full">
              <ProgressItem label="Uploading audio file" active={status === 'uploading'} done={['transcribing', 'summarizing', 'done'].includes(status)} />
              <ProgressItem label="Transcribing with Whisper API" active={status === 'transcribing'} done={['summarizing', 'done'].includes(status)} />
              <ProgressItem label="Generating Insights with GPT" active={status === 'summarizing'} done={status === 'done'} />
            </div>
            {status === 'done' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-emerald-400 flex items-center gap-2 font-medium">
                <Check size={20} /> Process Complete! Redirecting...
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ProgressItem({ label, active, done }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border ${active ? 'bg-indigo-500/10 border-indigo-500/30' : done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-800/50 border-slate-700/50'} transition-colors`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-indigo-500 text-white' : done ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
        {done ? <Check size={16} /> : active ? <Loader2 size={16} className="animate-spin" /> : <div className="w-2 h-2 bg-current rounded-full" />}
      </div>
      <span className={`font-medium ${active ? 'text-indigo-400' : done ? 'text-emerald-400' : 'text-slate-500'}`}>{label}</span>
      {active && <span className="ml-auto text-xs text-indigo-400 font-mono animate-pulse">Processing...</span>}
    </div>
  )
}
