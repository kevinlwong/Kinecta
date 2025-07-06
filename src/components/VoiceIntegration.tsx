// 'use client'

// import { useState, useRef } from 'react'
// import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'

// interface Props {
//   text: string
//   heritage: string
//   gender: 'male' | 'female'
// }

// export default function VoiceIntegration({ text, heritage, gender }: Props) {
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const audioUrlCache = useRef<Record<string,string>>({})

//   const generateVoice = async () => {
//     if (loading) return
//     if (isPlaying) {
//       setIsPlaying(false)
//       return
//     }

//     let url = audioUrlCache.current[text]
//     if (!url) {
//       setLoading(true)
//       try {
//         const res = await fetch('/api/generate-voice', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             text, heritage, gender,
//             accent: getAccentForHeritage(heritage),
//             age: 'elderly'
//           }),
//         })
//         if (!res.ok) throw new Error(await res.text())
//         const blob = await res.blob()
//         url = URL.createObjectURL(blob)
//         audioUrlCache.current[text] = url
//       } catch (e) {
//         alert('Voice generation failed.')
//         setLoading(false)
//         return
//       } finally {
//         setLoading(false)
//       }
//     }

//     const audio = new Audio(url)
//     audio.onended = () => setIsPlaying(false)
//     setIsPlaying(true)
//     audio.play()
//   }

//   return (
//     <button
//       onClick={generateVoice}
//       disabled={loading}
//       className="flex items-center space-x-2 px-3 py-1 rounded-md hover:bg-heritage-gold/10 transition-colors disabled:opacity-50"
//     >
//       { isPlaying ? <SpeakerXMarkIcon className="h-4 w-4 text-heritage-gold"/> 
//                    : <SpeakerWaveIcon className="h-4 w-4 text-heritage-gold"/> }
//       <span className="text-sm text-heritage-gold">
//         { loading ? 'Loading…' : isPlaying ? 'Stop' : 'Listen' }
//       </span>
//     </button>
//   )
// }