'use client'

import { useEffect } from 'react'
import { format } from 'date-fns'
import { useAncestorStore } from '@/store/ancestorStore'
import { BookmarkIcon, ShareIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export interface SavedConversation {
  id: string
  ancestorName: string
  heritage: string
  date: string       // ISO string
  messageCount: number
  preview: string
}

interface Props {
  onBookmark: (id: string) => void
  onShare: (id: string) => void
}

export default function ConversationHistory({ onBookmark, onShare }: Props) {
  const { conversations, loadConversations } = useAncestorStore()

  useEffect(() => {
    loadConversations()   // e.g. fetch from localStorage or API
  }, [loadConversations])

  const exportConversation = (conversation: SavedConversation) => {
    const text = conversation.preview + '\n\n...'  // build real transcript
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kinecta-convo-${conversation.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 heritage-gradient bg-clip-text text-transparent">
        Your Ancestor Conversations
      </h2>
      <div className="grid gap-4">
        {conversations.map((c) => (
          <div key={c.id} className="bg-white rounded-lg shadow-sm border border-heritage-gold/20 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-heritage-dark">{c.ancestorName}</h3>
                <p className="text-sm text-heritage-dark/60">{c.heritage}</p>
                <p className="text-sm text-heritage-dark/80 mt-2">{c.preview}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onBookmark(c.id)}
                  className="p-2 hover:bg-heritage-gold/10 rounded-lg"
                >
                  <BookmarkIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onShare(c.id)}
                  className="p-2 hover:bg-heritage-gold/10 rounded-lg"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => exportConversation(c)}
                  className="p-2 hover:bg-heritage-gold/10 rounded-lg"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-4 text-xs text-heritage-dark/60 flex items-center justify-between">
              <span>{c.messageCount} messages</span>
              <span>{format(new Date(c.date), 'MMM d, yyyy')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}