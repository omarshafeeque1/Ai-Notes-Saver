'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  LogOut, 
  Folder, 
  Clock, 
  Star, 
  Wand2, 
  Brain, 
  ChevronRight, 
  Hash, 
  Filter, 
  Loader2, 
  Download,
  FileText,
  FileDown,
  X,
  MoreVertical
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Editor from '@/components/Editor'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import TurndownService from 'turndown'

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  is_favorite: boolean
  updated_at: string
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState<any>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [enhancingId, setEnhancingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [sortBy, setSortBy] = useState<'desc' | 'asc'>('desc')
  
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        fetchNotes()
      }
    }
    checkUser()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes')
      const data = await response.json()
      if (response.ok) {
        setNotes(data)
        if (data.length > 0 && !selectedNoteId) {
          setSelectedNoteId(data[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async () => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Ingestion', content: '' }),
      })
      const data = await response.json()
      if (response.ok) {
        setNotes([data, ...notes])
        setSelectedNoteId(data.id)
        setIsAdding(false)
      } else {
        alert('Failed to create note: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating note:', error)
      alert('Network error')
    }
  }

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to purge this neural link?')) return
    try {
      const response = await fetch(`/api/notes?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setNotes(notes.filter(n => n.id !== id))
        if (selectedNoteId === id) {
          setSelectedNoteId(notes.length > 1 ? (notes[0].id === id ? notes[1].id : notes[0].id) : null)
        }
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleRenameNote = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (id: string, newTitle: string) => {
        // Immediate local state update
        setNotes(notes => notes.map(n => n.id === id ? { ...n, title: newTitle } : n));
        
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            await fetch(`/api/notes/update`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, title: newTitle }),
            });
          } catch (error) {
            console.error('Error renaming note:', error);
          }
        }, 800);
      };
    })(),
    []
  );

  const handleTogglePin = async (id: string, is_favorite: boolean) => {
    const newVal = !is_favorite
    setNotes(notes => notes.map(n => n.id === id ? { ...n, is_favorite: newVal } : n))
    try {
      await fetch(`/api/notes/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_favorite: newVal }),
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleAIAction = async (action: string, text: string) => {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, content: text }),
      })
      const data = await response.json()
      if (response.ok) {
        return data.result
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('AI Action Failed:', error)
      return text
    }
  }

  // Debounced update function
  const debouncedUpdate = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (id: string, content: string) => {
        clearTimeout(timeoutId);
        setIsSaving(true);
        timeoutId = setTimeout(async () => {
          try {
            const response = await fetch(`/api/notes/update`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, content }),
            });
            if (response.ok) {
              setNotes(prev => prev.map(n => n.id === id ? { ...n, content, updated_at: new Date().toISOString() } : n));
            }
          } catch (error) {
            console.error('Error updating note:', error);
          } finally {
            setIsSaving(false);
          }
        }, 1000); // 1 second debounce
      };
    })(),
    []
  );

  const handleUpdateContent = (id: string, content: string) => {
    // Immediate state update for responsiveness
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content } : n));
    debouncedUpdate(id, content);
  };

  const handleEnhance = async (id: string, content: string) => {
    setEnhancingId(id)
    try {
      const response = await fetch('/api/notes/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await response.json()
      if (response.ok) {
        const enhancedContent = data.enhancedContent
        handleUpdateContent(id, enhancedContent)
      }
    } catch (error) {
      console.error('Error enhancing note:', error)
    } finally {
      setEnhancingId(null)
    }
  }

  const exportAsTXT = () => {
    const note = notes.find(n => n.id === selectedNoteId)
    if (!note) return
    const element = document.createElement("a")
    const file = new Blob([note.content.replace(/<[^>]*>/g, '')], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `${note.title}.txt`
    document.body.appendChild(element)
    element.click()
  }

  const exportAsMD = () => {
    const note = notes.find(n => n.id === selectedNoteId)
    if (!note) return
    const turndownService = new TurndownService()
    const markdown = turndownService.turndown(note.content)
    const element = document.createElement("a")
    const file = new Blob([markdown], {type: 'text/markdown'})
    element.href = URL.createObjectURL(file)
    element.download = `${note.title}.md`
    document.body.appendChild(element)
    element.click()
  }

  const exportAsPDF = async () => {
    const note = notes.find(n => n.id === selectedNoteId)
    if (!note) return
    
    setIsSaving(true)
    const editorElement = document.querySelector('.ProseMirror') as HTMLElement
    if (!editorElement) return

    const canvas = await html2canvas(editorElement, {
      backgroundColor: '#050505',
      scale: 2,
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    })
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`${note.title}.pdf`)
    setIsSaving(false)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const selectedNote = notes.find(n => n.id === selectedNoteId)
  const filteredNotes = notes
    .filter(n => 
      (n.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (n.content || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1
      const timeA = new Date(a.updated_at || 0).getTime()
      const timeB = new Date(b.updated_at || 0).getTime()
      return sortBy === 'desc' ? timeB - timeA : timeA - timeB
    })

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden selection:bg-purple-500/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Sidebar - Fix Layout and Functionality */}
      <aside className="w-80 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-6 flex flex-col relative z-20">
        <div className="flex items-center gap-4 mb-10 px-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/10">
            <Brain size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">NotesSaver<span className="text-purple-500">.</span></span>
        </div>

        <button 
          onClick={handleCreateNote}
          className="w-full mb-8 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={3} />
          Create New Note
        </button>

        <div className="flex-1 overflow-y-auto space-y-8 scrollbar-hide">
          <div>
            <div className="flex items-center justify-between mb-4 px-4">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">All Repositories</p>
               <button 
                 onClick={() => setSortBy(prev => prev === 'desc' ? 'asc' : 'desc')}
                 className="text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors"
               >
                 {sortBy === 'desc' ? 'Latest' : 'Oldest'}
               </button>
            </div>
            <div className="space-y-1">
              {filteredNotes.length === 0 && !loading && (
                <p className="px-4 py-8 text-[10px] font-bold text-gray-700 uppercase text-center border-2 border-dashed border-white/5 rounded-2xl">Void Detected</p>
              )}
              {filteredNotes.map(note => (
                <div 
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`
                    group flex items-center justify-between gap-3 p-4 rounded-xl cursor-pointer transition-all
                    ${selectedNoteId === note.id ? 'bg-white/[0.05] ring-1 ring-white/10 shadow-xl' : 'hover:bg-white/[0.02] text-gray-500'}
                  `}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button 
                       onClick={(e) => {
                         e.stopPropagation()
                         handleTogglePin(note.id, note.is_favorite)
                       }}
                       className={`p-1 shrink-0 transition-colors ${note.is_favorite ? 'text-yellow-500' : 'text-gray-700 hover:text-white'}`}
                    >
                       <Star size={12} fill={note.is_favorite ? "currentColor" : "none"} />
                    </button>
                    <span className={`text-xs font-black truncate tracking-tight ${selectedNoteId === note.id ? 'text-white' : 'group-hover:text-gray-300'}`}>
                      {note.title || 'Untitled Ingestion'}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-sm font-black text-white border border-white/5">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-[8px] font-bold text-purple-500/60 uppercase tracking-widest">Neural Link Active</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full py-3 flex items-center justify-center gap-3 text-gray-600 hover:text-red-400 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Overhaul */}
      <main className="flex-1 overflow-hidden flex flex-col relative z-10 bg-grid">
        <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative group max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-purple-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Query neural patterns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-2 text-xs font-bold outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
            
            {isSaving && (
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-500/60 animate-pulse">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                Updating Repository
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-xl">
               <button 
                 onClick={exportAsTXT}
                 className="p-2 hover:bg-white/5 text-gray-500 hover:text-white rounded-lg transition-all"
                 title="Export TXT"
               >
                 <FileText size={18} />
               </button>
               <button 
                 onClick={exportAsMD}
                 className="p-2 hover:bg-white/5 text-gray-500 hover:text-white rounded-lg transition-all"
                 title="Export Markdown"
               >
                 <Hash size={18} />
               </button>
               <button 
                 onClick={exportAsPDF}
                 className="p-2 hover:bg-white/5 text-gray-500 hover:text-white rounded-lg transition-all"
                 title="Export PDF"
               >
                 <FileDown size={18} />
               </button>
            </div>
            <button 
              onClick={() => selectedNote && handleEnhance(selectedNote.id, selectedNote.content)}
              disabled={!selectedNote || enhancingId === selectedNote.id}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
            >
              {enhancingId ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
              AI Enhance
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-12">
            {!selectedNote ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-40">
                <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mb-8">
                  <Brain size={40} className="text-gray-800" />
                </div>
                <h2 className="text-3xl font-black mb-4">Select a neural node to commence.</h2>
                <p className="text-gray-500 font-bold max-w-sm">Synchronize your biological thoughts with our digital layer.</p>
              </div>
            ) : (
              <motion.div 
                key={selectedNote.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <input 
                  value={selectedNote.title}
                  onChange={(e) => handleRenameNote(selectedNote.id, e.target.value)}
                  className="w-full bg-transparent text-6xl font-black tracking-tightest outline-none border-none placeholder:text-gray-900 focus:ring-0"
                  placeholder="Untitled Ingestion"
                />
                
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock size={12} />
                    Last Updated: {new Date(selectedNote.updated_at).toLocaleString()}
                  </div>
                  <div className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full">
                    Latency: 12ms
                  </div>
                </div>

                <Editor 
                  content={selectedNote.content}
                  onChange={(content) => handleUpdateContent(selectedNote.id, content)}
                  onAutoSave={() => {}}
                  onAIAction={handleAIAction}
                  onTitleChange={(newTitle) => handleRenameNote(selectedNote.id, newTitle)}
                />
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
