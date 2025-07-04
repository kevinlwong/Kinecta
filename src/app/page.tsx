'use client'

import { useState } from 'react'
import HeritageSelector from '@/components/HeritageSelector'
import ChatInterface from '@/components/ChatInterface'
import { useAncestorStore } from '@/store/ancestorStore'

export default function Home() {
  const { resetSelection } = useAncestorStore()
  const [showChat, setShowChat] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-heritage-light via-white to-heritage-gold/20">
      <div className="container mx-auto px-4 py-8">
        {!showChat ? (
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-5xl font-bold mb-4 heritage-gradient bg-clip-text text-transparent">
                AI Ancestor
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

            {/* Heritage Selection */}
            <HeritageSelector onComplete={() => setShowChat(true)} />
          </div>
        ) : (
          <ChatInterface onBack={() => {
            resetSelection()
            setShowChat(false)
          }} />
        )}
      </div>
    </main>
  )
}