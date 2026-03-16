'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  Eraser,
  Highlighter,
  Sparkles,
  MessageSquareText,
  Wand2,
  CheckSquare,
  ChevronDown,
  Wand
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  onAutoSave: () => void
  onAIAction?: (action: string, text: string) => Promise<string>
  onTitleChange?: (title: string) => void
}

const MenuBar = ({ editor, onTriggerAI }: { editor: any, onTriggerAI: (action: string) => void }) => {
  const [showAIDropdown, setShowAIDropdown] = useState(false)
  
  if (!editor) return null

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-white/5 bg-black/50 sticky top-0 z-10 backdrop-blur-md items-center">
      <div className="relative">
        <button 
           onClick={() => setShowAIDropdown(!showAIDropdown)}
           className="px-3 py-1.5 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-xs font-black uppercase text-white shadow-lg shadow-purple-500/20 transition-all"
        >
           <Wand size={14} /> AI Tools <ChevronDown size={14} />
        </button>

        {showAIDropdown && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-1">
             <AIOption onClick={() => { onTriggerAI('summarize'); setShowAIDropdown(false) }}>Summarize</AIOption>
             <AIOption onClick={() => { onTriggerAI('expand'); setShowAIDropdown(false) }}>Expand Details</AIOption>
             <AIOption onClick={() => { onTriggerAI('simplify'); setShowAIDropdown(false) }}>Simplify Text</AIOption>
             <AIOption onClick={() => { onTriggerAI('fix_grammar'); setShowAIDropdown(false) }}>Fix Grammar</AIOption>
             <AIOption onClick={() => { onTriggerAI('convert_to_bullets'); setShowAIDropdown(false) }}>To Bullets</AIOption>
             <AIOption onClick={() => { onTriggerAI('generate_title'); setShowAIDropdown(false) }}>Gen Title</AIOption>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-white/10 mx-2 self-center" />
      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleBold().run()} 
        active={editor.isActive('bold')}
        icon={<Bold size={16} />}
      />
      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        active={editor.isActive('italic')}
        icon={<Italic size={16} />}
      />
      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleUnderline().run()} 
        active={editor.isActive('underline')}
        icon={<UnderlineIcon size={16} />}
      />
      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleHighlight().run()} 
        active={editor.isActive('highlight')}
        icon={<Highlighter size={16} />}
      />

      <div className="w-px h-6 bg-white/10 mx-1 self-center" />

      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
        active={editor.isActive('heading', { level: 1 })}
        icon={<Heading1 size={16} />}
      />
      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
        active={editor.isActive('heading', { level: 2 })}
        icon={<Heading2 size={16} />}
      />
      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
        active={editor.isActive('heading', { level: 3 })}
        icon={<Heading3 size={16} />}
      />

      <div className="w-px h-6 bg-white/10 mx-1 self-center" />

      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleBulletList().run()} 
        active={editor.isActive('bulletList')}
        icon={<List size={16} />}
      />
      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        active={editor.isActive('orderedList')}
        icon={<ListOrdered size={16} />}
      />
      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
        active={editor.isActive('codeBlock')}
        icon={<Code size={16} />}
      />
      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleBlockquote().run()} 
        active={editor.isActive('blockquote')}
        icon={<Quote size={16} />}
      />

      <div className="w-px h-6 bg-white/10 mx-1 self-center" />

      <ToolbarButton 
        onClick={() => editor.chain().focus().undo().run()} 
        disabled={!editor.can().undo()}
        icon={<Undo size={16} />}
      />
      <ToolbarButton 
        onClick={() => editor.chain().focus().redo().run()} 
        disabled={!editor.can().redo()}
        icon={<Redo size={16} />}
      />
      <ToolbarButton 
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} 
        icon={<Eraser size={16} />}
      />
    </div>
  )
}

const ToolbarButton = ({ onClick, active = false, disabled = false, icon }: { onClick: () => void, active?: boolean, disabled?: boolean, icon: React.ReactNode }) => (
  <button
    onClick={(e) => {
      e.preventDefault()
      onClick()
    }}
    disabled={disabled}
    className={`
      p-2 rounded-lg transition-all
      ${active ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}
      ${disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    {icon}
  </button>
)

const AIOption = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className="w-full text-left px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
  >
    {children}
  </button>
)

export default function Editor({ content, onChange, onAutoSave, onAIAction, onTitleChange }: EditorProps) {
  const [isAILoading, setIsAILoading] = useState(false)

  const handleAIAction = async (action: string, isBubble: boolean) => {
    if (!onAIAction) return

    const selectedText = isBubble 
      ? editor?.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to) 
      : editor?.getText()

    if (!selectedText) return

    setIsAILoading(true)
    try {
      const result = await onAIAction(action, selectedText)
      if (isBubble) {
        editor?.chain().focus().insertContent(result).run()
      } else {
        editor?.commands.setContent(result)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsAILoading(false)
    }
  }

  const triggerToolbarAI = async (action: string) => {
    if (!editor) return
    
    if (action === 'generate_title') {
      if (!onAIAction) return
      setIsAILoading(true)
      try {
        const result = await onAIAction(action, editor.getText())
        if (onTitleChange) onTitleChange(result.trim())
      } catch (e) {
        console.error(e)
      } finally {
        setIsAILoading(false)
      }
      return
    }

    // If text is selected, act on it. Otherwise act on entire text.
    const isSelection = !editor.state.selection.empty
    handleAIAction(action, isSelection)
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      CharacterCount,
      Placeholder.configure({
        placeholder: 'Commence neural data dump... Type to write, or select text for AI.',
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] p-8 font-medium leading-relaxed'
      }
    }
  })

  // Update content ONLY when it changes externally (like switching notes)
  // and NOT while the user is actively typing (isFocused)
  useEffect(() => {
    if (editor && !editor.isFocused && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className="w-full flex flex-col bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-white/10 transition-all shadow-2xl relative relative">
      <MenuBar editor={editor} onTriggerAI={triggerToolbarAI} />
      
      {editor && (
        <BubbleMenu editor={editor} className="flex bg-black/80 backdrop-blur-md border border-purple-500/30 rounded-xl overflow-hidden shadow-2xl p-1 gap-1">
          <button onClick={() => handleAIAction('explain', true)} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
             <MessageSquareText size={14} /> Explain
          </button>
          <button onClick={() => handleAIAction('improve', true)} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
             <Sparkles size={14} /> Improve
          </button>
          <button onClick={() => handleAIAction('summarize', true)} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
             <List size={14} /> Summarize
          </button>
          <button onClick={() => handleAIAction('idea', true)} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
             <Wand2 size={14} /> Idea
          </button>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu editor={editor} className="flex bg-black/80 backdrop-blur-md border border-blue-500/30 rounded-xl overflow-hidden shadow-2xl p-1 gap-1">
          <button onClick={() => handleAIAction('todo', false)} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
             <CheckSquare size={14} /> /todo
          </button>
          <button onClick={() => handleAIAction('idea', false)} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
             <Wand2 size={14} /> /ideas
          </button>
          <button onClick={() => handleAIAction('rewrite', false)} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
             <Sparkles size={14} /> /rewrite
          </button>
        </FloatingMenu>
      )}

      {isAILoading && (
         <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse bg-purple-500 text-white px-4 py-2 rounded-full shadow-lg shadow-purple-500/30">AI Processing...</p>
         </div>
      )}

      <EditorContent editor={editor} />

      <div className="flex items-center justify-end px-8 py-4 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-600 gap-4">
         <span>{editor?.storage.characterCount.words()} words</span>
         <span>{Math.ceil((editor?.storage.characterCount.words() || 0) / 200)} min read</span>
      </div>
    </div>
  )
}
