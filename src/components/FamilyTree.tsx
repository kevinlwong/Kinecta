'use client'

import { useState } from 'react'
import { useAncestorStore } from '@/store/ancestorStore'

interface FamilyMember {
  id: string
  name: string
  relationship: string
  heritage: string
  timePeriod: string
}

export default function FamilyTree() {
  const { setSelectedHeritage, setAncestorPersona } = useAncestorStore()
  const [members] = useState<FamilyMember[]>([
    { id:'1', name:'Great-Grandfather', relationship:'great-grandfather', heritage:'hakka', timePeriod:'1920s-1940s' },
    // …
  ])
  const [activeId, setActiveId] = useState<string>('1')
  const [showAdd, setShowAdd] = useState(false)

  const selectAncestor = (m: FamilyMember) => {
    setActiveId(m.id)
    setSelectedHeritage({
      ethnicity: m.heritage,
      region: '', timePeriod: m.timePeriod,
      relationship: m.relationship, occupation:'', traits:''
    })
    setAncestorPersona({
        ...m,
        ethnicity: '',
        region: '',
        occupation: '',
        traits: ''
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 heritage-gradient bg-clip-text text-transparent">
        Your Family Tree
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <div
            key={m.id}
            onClick={() => selectAncestor(m)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              m.id === activeId 
              ? 'bg-heritage-gold/20 border-2 border-heritage-gold'
              : 'bg-white border border-heritage-gold/20 hover:border-heritage-gold/40'
            }`}
          >
            {/* ... identical inner UI ... */}
          </div>
        ))}
        <div
          onClick={() => setShowAdd(true)}
          className="p-4 rounded-lg border-2 border-dashed border-heritage-gold/40 hover:border-heritage-gold/60 cursor-pointer transition-colors"
        >
          {/* “+ Add Ancestor” card */}
        </div>
      </div>
      {showAdd && (
        <div className="fixed inset-0 flex items-center justify-center">
          {/* TODO: Your <AddAncestorModal /> */}
        </div>
      )}
    </div>
  )
}