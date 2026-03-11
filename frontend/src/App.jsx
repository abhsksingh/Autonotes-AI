import { useState, useEffect } from 'react'
import { Mic, History, UploadCloud, Settings, LogOut } from 'lucide-react'
import LandingPage from './pages/LandingPage'
import UploadPage from './pages/UploadPage'
import Dashboard from './pages/Dashboard'
import HistoryPage from './pages/HistoryPage'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [currentMeetingId, setCurrentMeetingId] = useState(null)

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentPage('upload')} />
      case 'upload':
        return <UploadPage onUploadComplete={(id) => {
          setCurrentMeetingId(id)
          setCurrentPage('dashboard')
        }} />
      case 'dashboard':
        return <Dashboard meetingId={currentMeetingId} onBack={() => setCurrentPage('history')} />
      case 'history':
        return <HistoryPage onMeetingSelect={(id) => {
          setCurrentMeetingId(id)
          setCurrentPage('dashboard')
        }} />
      default:
        return <LandingPage />
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 flex">
      {/* Sidebar Navigation */}
      {currentPage !== 'landing' && (
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Mic size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">AutoNotes AI</span>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <NavItem 
              icon={<UploadCloud size={20} />} 
              label="New Meeting" 
              active={currentPage === 'upload'} 
              onClick={() => setCurrentPage('upload')} 
            />
            <NavItem 
              icon={<History size={20} />} 
              label="Meeting History" 
              active={currentPage === 'history'} 
              onClick={() => setCurrentPage('history')} 
            />
            <div className="pt-8 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Settings
            </div>
            <NavItem 
              icon={<Settings size={20} />} 
              label="Preferences" 
              active={false} 
              onClick={() => {}} 
            />
          </nav>
          
          <div className="p-4 border-t border-slate-800">
            <button className="flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-white transition-colors rounded-lg">
              <LogOut size={20} />
              <span>Log out</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg transition-all ${
        active 
          ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default App
