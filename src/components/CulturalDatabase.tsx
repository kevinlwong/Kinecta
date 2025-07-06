// src/components/CulturalDatabase.tsx
'use client'

import { useState } from 'react'
import {
  culturalSayings,
  historicalPeriods,
  traditionalOccupations
} from '@/utils/culturalData'

// Unified data item type
interface DataItem {
  content: string
  type: string
  heritage?: string
  context?: string
  timePeriod?: string
}

interface Props {
  onSelect: (item: DataItem) => void
}

export default function CulturalDatabase({ onSelect }: Props) {
  const [heritageFilter, setHeritageFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Build unified dataset
  const allData: DataItem[] = [
    // Cultural sayings
    ...culturalSayings.map(s => ({
      content: s.english,
      type: 'Saying',
      heritage: s.heritage,
      context: s.context
    })),

    // Historical periods
    ...historicalPeriods.map(p => ({
      content: p.name,
      type: 'Period',
      timePeriod: `${p.startYear}-${p.endYear}`
    })),

    // Traditional occupations
    ...traditionalOccupations.map(o => ({
      content: o.name,
      type: 'Occupation',
      context: o.description,
      timePeriod: o.timePeriods.join(', ')
    })),
  ]

  // Apply filters
  const filtered = allData.filter(item => {
    const heritageMatch =
      heritageFilter === 'all' ||
      (item.heritage ? item.heritage === heritageFilter : true)
    const typeMatch =
      typeFilter === 'all' ||
      item.type.toLowerCase() === typeFilter
    return heritageMatch && typeMatch
  })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 heritage-gradient bg-clip-text text-transparent">
        Cultural Knowledge Base
      </h2>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select
          value={heritageFilter}
          onChange={e => setHeritageFilter(e.target.value)}
          className="px-4 py-2 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold"
        >
          <option value="all">All Heritage</option>
          <option value="hakka">Hakka</option>
          <option value="hokkien">Hokkien</option>
          <option value="cantonese">Cantonese</option>
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold"
        >
          <option value="all">All Types</option>
          <option value="saying">Saying</option>
          <option value="period">Period</option>
          <option value="occupation">Occupation</option>
        </select>
      </div>

      {/* Data Display */}
      <div className="grid gap-4">
        {filtered.map(item => (
          <div
            key={`${item.type}-${item.content}`}
            onClick={() => onSelect(item)}
            className="bg-white rounded-lg shadow-sm border border-heritage-gold/20 p-4 cursor-pointer hover:bg-heritage-gold/10 transition-colors"
          >
            <span className="block text-xs text-heritage-dark/60 capitalize">{item.type}</span>
            <h3 className="font-semibold text-heritage-dark mb-1">{item.content}</h3>
            {item.context && <p className="text-sm text-heritage-dark/70">{item.context}</p>}
            {item.timePeriod && <p className="text-xs text-heritage-dark/50">{item.timePeriod}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
