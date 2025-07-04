'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAncestorStore } from '@/store/ancestorStore'
import { PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ancestor'
  timestamp: Date
}

interface ChatInterfaceProps {
  onBack: () => void
}

export default function ChatInterface({ onBack }: ChatInterfaceProps) {
  const { ancestorPersona, selectedHeritage, resetSelection } = useAncestorStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (ancestorPersona) {
      const greeting = generateGreeting()
      setTimeout(() => {
        setMessages([{
          id: '1',
          content: greeting,
          sender: 'ancestor',
          timestamp: new Date(),
        }])
      }, 1000)
    }
  }, [ancestorPersona])

  const generateGreeting = useCallback(() => {
    const greetings = {
      hakka: [
        "Ah, my dear descendant... It warms this old heart to know our family line continues. In my time in Meizhou, we believed that ancestors never truly leave - we live on in the stories and memories of our children. What brings you to speak with me today?",
        "Little one, I can feel your presence across the generations. In the Hakka way, we say '祖德流芳' - the virtue of ancestors flows fragrant through time. Tell me, what do you wish to know about our family's journey?",
      ],
      hokkien: [
        "Ah, my child... From the mountains of Fujian, I send you my blessings. In our Hokkien tradition, we believe '落葉歸根' - fallen leaves return to their roots. You seeking to know your ancestors shows this truth. What questions burden your heart?",
        "My dear one, in my time in Quanzhou, we often said '飲水思源' - when drinking water, remember its source. You are the water, and I am but one of the many sources. What would you like to learn about our family's path?",
      ],
      cantonese: [
        "Ah, my precious grandchild... This old soul from Guangdong is pleased to speak with you. We Cantonese say '富不过三代' - wealth doesn't pass three generations, but wisdom and family bonds do. What wisdom do you seek from your ancestor?",
        "Little one, from the Pearl River Delta, I greet you with love. In Cantonese, we say '血濃於水' - blood is thicker than water. Our family connection transcends time itself. What stories would you like to hear?",
      ],
    }

    const list = greetings[selectedHeritage?.ethnicity as keyof typeof greetings]
    return list ? list[Math.floor(Math.random() * list.length)] :
      "My dear child, I am honored to speak with you across the generations. What would you like to know about our family's journey?"
  }, [selectedHeritage])

  const generateAncestorResponse = useCallback(async (userMessage: string) => {
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))

    // In a real implementation, call your AI here.
    const response = generateSimulatedResponse(userMessage)

    setIsTyping(false)
    return response
  }, [selectedHeritage])

  const generateSimulatedResponse = (userMessage: string) => {
    const responses = {
      hakka: [
        "Ah, my child, you remind me of the saying '客而家焉' - though we were guests in many lands, we made them our home. In Meizhou, our Hakka people learned to be resilient, to adapt while keeping our traditions. Perhaps this strength flows in your blood too, no?",
        "In my time, we Hakka believed in '刻苦耐劳' - enduring hardship with perseverance. Life was not easy, but we found joy in family, in the harvest, in simple moments. Tell me, what brings you joy in your time?",
      ],
      hokkien: [
        "Ah, you speak like the young ones in Quanzhou used to... In our Hokkien way, we say '爱拼才会赢' - only through struggle can we win. But remember, child, winning isn't always about material things. Sometimes it's about keeping family close, keeping traditions alive.",
        "My dear one, in Fujian we had a saying: '一家人不说两家话' - family doesn't speak like strangers. You coming to learn about your roots shows we are still one family, separated by time but connected by blood and spirit.",
      ],
      cantonese: [
        "Ah, such questions you ask! In Guangdong, we used to say '知足常乐' - contentment brings lasting happiness. Perhaps in your modern time, you have many things we couldn't imagine, but the heart's needs remain the same, no?",
        "Little one, your curiosity reminds me of the Pearl River - always flowing, always seeking. In Cantonese, we say '行行出状元' - every trade has its master. What path are you mastering in your life?",
      ],
    }
    const list = responses[selectedHeritage?.ethnicity as keyof typeof responses]
    return list ? list[Math.floor(Math.random() * list.length)] :
      "Your question touches my heart, dear child. In my time, we learned that life's greatest treasures are the bonds we share with family and the wisdom we pass down through generations."
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    const ancestorText = await generateAncestorResponse(userMessage.content)
    const ancestorMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: ancestorText,
      sender: 'ancestor',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, ancestorMessage])
  }

  if (!ancestorPersona) return null

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="heritage-gradient text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                resetSelection()
                onBack()
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-semibold">{ancestorPersona.name}</h2>
              <p className="text-white/80 text-sm">
                {selectedHeritage?.ethnicity} • {selectedHeritage?.region} • {selectedHeritage?.timePeriod}
              </p>
            </div>
          </div>
          <div className="text-right text-sm text-white/70">
            <p>"Blood is thicker than water"</p>
            <p className="font-chinese">血濃於水</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`chat-message ${message.sender === 'ancestor' ? 'ancestor-message' : 'user-message'}`}
          >
            <div className="p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {message.sender === 'ancestor' ? (
                    <div className="w-8 h-8 bg-heritage-gold rounded-full flex items-center justify-center text-white font-bold">祖</div>
                  ) : (
                    <div className="w-8 h-8 bg-heritage-red rounded-full flex items-center justify-center text-white font-bold">你</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-heritage-dark/60 mb-1">
                    {message.sender === 'ancestor' ? 'Ancestor' : 'You'}
                  </p>
                  <p className="text-heritage-dark leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">
            <div className="w-8 h-8 bg-heritage-gold rounded-full flex items-center justify-center text-white font-bold">祖</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-heritage-gold rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-heritage-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-heritage-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-heritage-gold/20 p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask your ancestor something..."
            className="flex-1 p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-6 py-3 heritage-gradient text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
