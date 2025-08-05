'use client'

import { useState, useEffect, useCallback } from 'react'
import HeritageSelector from '@/components/HeritageSelector'
import ChatInterface from '@/components/ChatInterface'
import ConversationHistory from '@/components/ConversationHistory'
import CulturalDatabase, { DataItem } from '@/components/CulturalDatabase'
import UserProfile from '@/components/UserProfile'
import { useAncestorStore, SavedConversation, ConversationMessage } from '@/store/ancestorStore'

export default function Home() {
  const {
    selectedHeritage,
    ancestorPersona,
    resetSelection,
    loadConversations,
    addConversation,
    updateConversation,
    deleteConversation,
    bookmarkConversation,
    shareConversation,
    resumeConversation,
    currentConversationId,
    setCurrentConversationId
  } = useAncestorStore()

  // which “tab” we're on
  const [view, setView] = useState<'select'|'chat'|'history'>('select')

  // load history once on mount
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // called when a chat message is sent/received
  const handleEndConversation = useCallback((messages: Array<{id: string, content: string, sender: 'user' | 'ancestor', timestamp: Date}>) => {
    if (!ancestorPersona || !selectedHeritage || messages.length === 0) return;

    const conversationMessages: ConversationMessage[] = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender,
      timestamp: msg.timestamp
    }));

    const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
    const lastAncestorMessage = messages.filter(m => m.sender === 'ancestor').pop();
    
    const preview = lastUserMessage && lastAncestorMessage 
      ? `${lastUserMessage.content.substring(0, 50)}... — ${lastAncestorMessage.content.substring(0, 50)}...`
      : messages[messages.length - 1]?.content.substring(0, 100) + '...' || '';

    const conversation: SavedConversation = {
      id: currentConversationId || Date.now().toString(),
      ancestorName: ancestorPersona.name,
      heritage: selectedHeritage.ethnicity,
      date: new Date().toISOString(),
      messageCount: messages.length,
      preview,
      messages: conversationMessages,
      ancestorPersona: {
        name: ancestorPersona.name,
        ethnicity: ancestorPersona.ethnicity,
        region: ancestorPersona.region,
        timePeriod: ancestorPersona.timePeriod,
        occupation: ancestorPersona.occupation,
        traits: ancestorPersona.traits,
      },
      selectedHeritage: {
        ethnicity: selectedHeritage.ethnicity,
        region: selectedHeritage.region,
        timePeriod: selectedHeritage.timePeriod,
        relationship: selectedHeritage.relationship,
        occupation: selectedHeritage.occupation,
        traits: selectedHeritage.traits,
      }
    };

    // If we have a current conversation ID, update it; otherwise create new
    if (currentConversationId) {
      updateConversation(conversation);
    } else {
      addConversation(conversation);
    }
  }, [addConversation, updateConversation, ancestorPersona, selectedHeritage, currentConversationId])

  // inject a cultural snippet into the chat
  const handleInject = useCallback((item: DataItem) => {
    window.dispatchEvent(new CustomEvent('kinecta-inject', { detail: item.content }))
  }, [])

  // resume a conversation from history
  const handleResumeConversation = useCallback((conversation: SavedConversation) => {
    resumeConversation(conversation)
    setView('chat')
  }, [resumeConversation])

  return (
    <main className="min-h-screen bg-gradient-to-br from-heritage-light via-white to-heritage-gold/20">
      {/* Header with User Profile */}
      <header className="flex justify-between items-center p-6">
        <div className="flex-1"></div>
        <UserProfile />
      </header>

      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 heritage-gradient bg-clip-text text-transparent">
          Kinecta
        </h1>
        <p className="text-xl text-heritage-dark/70 mb-8 max-w-2xl mx-auto">
          Bridge the generations. Connect with your heritage through meaningful conversations 
          with your ancestors, brought to life by AI.
        </p>
        <div className="flex justify-center items-center space-x-4 text-sm text-heritage-dark/60">
          <span>🏮 Hakka</span>
          <span>🏯 Hokkien</span>
          <span>🎋 Cantonese</span>
        </div>
      </div>
    
      <div className="container mx-auto px-4 py-8">
        {/* simple tab nav */}
        <nav className="flex space-x-4 mb-8">
          <button onClick={() => setView('select')}
                  className={`underline ${view==='select'?'text-heritage-gold':''}`}>
            👤 Pick
          </button>
          <button onClick={() => setView('chat')}
                  disabled={!ancestorPersona}
                  className={`underline ${view==='chat'?'text-heritage-gold':''}`}>
            💬 Chat
          </button>
          <button onClick={() => setView('history')}
                  className={`underline ${view==='history'?'text-heritage-gold':''}`}>
            📜 History
          </button>
        </nav>

        {view === 'select' && (
          <HeritageSelector onComplete={() => setView('chat')} />
        )}

        {view === 'chat' && ancestorPersona && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat panel */}
            <div className="lg:col-span-2">
              <ChatInterface
                onBack={() => {
                  resetSelection()
                  setView('select')
                }}
                onEndConversation={handleEndConversation}
                onInject={handleInject}
              />
            </div>

            {/* Cultural snippets sidebar */}
            <aside className="space-y-6">
              <CulturalDatabase onSelect={handleInject} />
            </aside>
          </div>
        )}

        {view === 'history' && (
          <ConversationHistory
            onBookmark={bookmarkConversation}
            onShare={shareConversation}
            onDelete={deleteConversation}
            onResume={handleResumeConversation}
          />
        )}
      </div>
    </main>
  )
}
