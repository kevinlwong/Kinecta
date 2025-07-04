'use client'

import { useState } from 'react'
import { useAncestorStore } from '@/store/ancestorStore'

interface HeritageSelectorProps {
  onComplete: () => void
}

// Dialect-specific labels for each relationship
const relationshipLabels = {
  'great-grandfather': {
    chars: '曾祖父',
    mandarin: 'zēng zǔ fù',
    cantonese: 'cang¹ zou² fu⁶',
    hokkien: 'cheng-chó͘-pē',
    hakka:   'chan¹-zu²-pu³',
  },
  'great-grandmother': {
    chars: '曾祖母',
    mandarin: 'zēng zǔ mǔ',
    cantonese: 'cang¹ zou² mou²',
    hokkien: 'cheng-chó͘-bó͘',
    hakka:   'chan¹-zu²-mu²',
  },
  'grandfather': {
    chars: '祖父',
    mandarin: 'zǔ fù',
    cantonese: 'zou² fu⁶',
    hokkien: 'chú-pē',
    hakka:   'zu²-pu³',
  },
  'grandmother': {
    chars: '祖母',
    mandarin: 'zǔ mǔ',
    cantonese: 'zou² mou²',
    hokkien: 'chú-bó͘',
    hakka:   'zu²-mu²',
  },
}

export default function HeritageSelector({ onComplete }: HeritageSelectorProps) {
  const { setSelectedHeritage, setAncestorPersona } = useAncestorStore()
  const [formData, setFormData] = useState({
    ethnicity: '',
    region: '',
    timePeriod: '',
    relationship: '',
    occupation: '',
    traits: '',
  })

  const ethnicityOptions = [
    { value: 'hakka',    label: 'Hakka (客家, Kèjiā)',   regions: ['Meizhou', 'Guangdong', 'Fujian', 'Jiangxi'] },
    { value: 'hokkien',  label: 'Hokkien (福建, Fújiàn)', regions: ['Quanzhou', 'Xiamen', 'Zhangzhou', 'Taiwan'] },
    { value: 'cantonese',label: 'Cantonese (廣東, Guǎngdōng)', regions: ['Guangzhou', 'Taishan', 'Hong Kong', 'Macau'] },
  ]

  const timePeriods = [
    { value: '1890s-1910s', label: '1890s-1910s (Late Qing Dynasty)' },
    { value: '1920s-1940s', label: '1920s-1940s (Republican Era)' },
    { value: '1950s-1970s', label: '1950s-1970s (Early PRC/Migration)' },
  ]

  const selectedEthnicity = ethnicityOptions.find(e => e.value === formData.ethnicity)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSelectedHeritage(formData)
    setAncestorPersona({
      name: `Your ${formData.relationship}`,
      ethnicity: formData.ethnicity,
      region: formData.region,
      timePeriod: formData.timePeriod,
      occupation: formData.occupation,
      traits: formData.traits,
    })
    onComplete()
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-center text-heritage-dark">
        Connect with Your Ancestor
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ethnicity */}
        <div>
          <label className="block text-sm font-medium text-heritage-dark mb-2">
            Heritage Background
          </label>
          <select
            value={formData.ethnicity}
            onChange={e => setFormData({ ...formData, ethnicity: e.target.value, region: '' })}
            className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
            required
          >
            <option value="">Select your heritage...</option>
            {ethnicityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Region */}
        {selectedEthnicity && (
          <div>
            <label className="block text-sm font-medium text-heritage-dark mb-2">
              Region of Origin
            </label>
            <select
              value={formData.region}
              onChange={e => setFormData({ ...formData, region: e.target.value })}
              className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
              required
            >
              <option value="">Select region...</option>
              {selectedEthnicity.regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        )}

        {/* Time Period */}
        <div>
          <label className="block text-sm font-medium text-heritage-dark mb-2">
            Time Period
          </label>
          <select
            value={formData.timePeriod}
            onChange={e => setFormData({ ...formData, timePeriod: e.target.value })}
            className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
            required
          >
            <option value="">Select time period...</option>
            {timePeriods.map(tp => (
              <option key={tp.value} value={tp.value}>{tp.label}</option>
            ))}
          </select>
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-medium text-heritage-dark mb-2">
            Relationship
          </label>
          <select
            value={formData.relationship}
            onChange={e => setFormData({ ...formData, relationship: e.target.value })}
            className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
            required
          >
            <option value="">Select relationship...</option>
            {Object.entries(relationshipLabels).map(([key, info]) => {
              // pick romanization based on chosen ethnicity
              const roman = formData.ethnicity && info[formData.ethnicity as keyof typeof info]
                ? info[formData.ethnicity as keyof typeof info]
                : info.mandarin
              const textLabel = 
                key.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())
              return (
                <option key={key} value={key}>
                  {`${textLabel} (${info.chars}, ${roman})`}
                </option>
              )
            })}
          </select>
        </div>

        {/* Optional */}
        <div>
          <label className="block text-sm font-medium text-heritage-dark mb-2">
            Occupation (Optional)
          </label>
          <input
            type="text"
            value={formData.occupation}
            onChange={e => setFormData({ ...formData, occupation: e.target.value })}
            placeholder="e.g., Rice farmer, Tea merchant, Tailor..."
            className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-heritage-dark mb-2">
            Known Traits or Stories (Optional)
          </label>
          <textarea
            rows={3}
            value={formData.traits}
            onChange={e => setFormData({ ...formData, traits: e.target.value })}
            placeholder="Any family stories or details you know..."
            className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 heritage-gradient text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Begin Conversation
        </button>
      </form>
    </div>
  )
}
