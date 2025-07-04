import { create } from 'zustand'

interface HeritageData {
  ethnicity: string
  region: string
  timePeriod: string
  relationship: string
  occupation: string
  traits: string
}

interface AncestorPersona {
  name: string
  ethnicity: string
  region: string
  timePeriod: string
  occupation: string
  traits: string
}

interface AncestorStore {
  selectedHeritage: HeritageData | null
  ancestorPersona: AncestorPersona | null
  setSelectedHeritage: (heritage: HeritageData) => void
  setAncestorPersona: (persona: AncestorPersona) => void
  resetSelection: () => void
}

export const useAncestorStore = create<AncestorStore>((set) => ({
  selectedHeritage: null,
  ancestorPersona: null,
  setSelectedHeritage: (heritage) => set({ selectedHeritage: heritage }),
  setAncestorPersona: (persona) => set({ ancestorPersona: persona }),
  resetSelection: () => set({ selectedHeritage: null, ancestorPersona: null }),
}))