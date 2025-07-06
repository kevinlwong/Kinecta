export interface CulturalSaying {
  chinese: string;
  pinyin: string;
  english: string;
  context: string;
  heritage: string;
}

export interface HistoricalPeriod {
  name: string;
  startYear: number;
  endYear: number;
  keyEvents: string[];
  economicConditions: string[];
  socialContext: string[];
}

export interface TraditionalOccupation {
  name: string;
  description: string;
  socialStatus: string;
  commonRegions: string[];
  timePeriods: string[];
}

export const culturalSayings: CulturalSaying[] = [
  {
    chinese: '客而家焉',
    pinyin: 'kè ér jiā yān',
    english: 'Though guests, we make it home',
    context: 'Hakka resilience and adaptability',
    heritage: 'hakka',
  },
  {
    chinese: '飲水思源',
    pinyin: 'yǐn shuǐ sī yuán',
    english: 'When drinking water, remember its source',
    context: 'Gratitude to ancestors and origins',
    heritage: 'hokkien',
  },
  {
    chinese: '血濃於水',
    pinyin: 'xuè nóng yú shuǐ',
    english: 'Blood is thicker than water',
    context: 'Family bonds transcend everything',
    heritage: 'cantonese',
  },
];

export const historicalPeriods: HistoricalPeriod[] = [
  {
    name: 'Late Qing Dynasty',
    startYear: 1890,
    endYear: 1912,
    keyEvents: ['Boxer Rebellion', 'Republican Revolution', 'Foreign Concessions'],
    economicConditions: ['Agricultural economy', 'Foreign trade pressure', 'Economic hardship'],
    socialContext: ['Traditional family structures', 'Confucian values', 'Resistance to change'],
  },
  {
    name: 'Republican Era',
    startYear: 1912,
    endYear: 1949,
    keyEvents: ['World War I impact', 'Japanese invasion', 'Civil War'],
    economicConditions: ['Industrial beginnings', 'War economy', 'Hyperinflation'],
    socialContext: ['Modernization attempts', 'Cultural revolution', 'Migration waves'],
  },
];

export const traditionalOccupations: TraditionalOccupation[] = [
  {
    name: 'Rice Farmer',
    description: 'Cultivated rice in terraced fields, often family-owned small plots',
    socialStatus: 'Respected but economically modest',
    commonRegions: ['Guangdong', 'Fujian', 'Jiangxi'],
    timePeriods: ['1890s-1950s'],
  },
  {
    name: 'Tea Merchant',
    description: 'Traded tea locally and internationally, often family businesses',
    socialStatus: 'Higher social standing, economically successful',
    commonRegions: ['Fujian', 'Guangdong'],
    timePeriods: ['1890s-1940s'],
  },
  {
    name: 'Tailor',
    description: 'Made traditional and modern clothing, often specialized skills',
    socialStatus: 'Skilled craftsperson, moderate income',
    commonRegions: ['Urban areas', 'Hong Kong', 'Singapore'],
    timePeriods: ['1920s-1960s'],
  },
];