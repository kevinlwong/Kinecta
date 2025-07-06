import { CulturalSaying, HistoricalPeriod, TraditionalOccupation } from './culturalData';
import { AncestorPersona, HeritageData } from '@/store/ancestorStore';

/**
 * Builds the system prompt for the OpenAI chat based on heritage and persona.
 */
export function buildAncestorPrompt(
  heritage: HeritageData,
  persona: AncestorPersona,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): string {
  const base = `You are simulating a ${heritage.ethnicity} ancestor from ${heritage.region} during the ${heritage.timePeriod} period.`;

  const details = [`Relationship: ${heritage.relationship}`];
  if (heritage.occupation) details.push(`Occupation: ${heritage.occupation}`);
  if (heritage.traits) details.push(`Additional context: ${heritage.traits}`);

  const culturalContext = `
    Context:
    - Heritage: ${heritage.ethnicity} from ${heritage.region}
    - Time Period: ${heritage.timePeriod}
    - Relationship: ${heritage.relationship}
    - Occupation: ${heritage.occupation || 'Unknown'}
    - Additional traits: ${heritage.traits || 'None provided'}
  `;

  const instructions = `
    Respond with warmth, wisdom, and humility.
    Use cultural expressions (including Chinese characters with Pinyin) where appropriate.
    Avoid making definitive historical claims; instead, use phrases like 'perhaps' and 'in my time.'
    Focus on universal human experiences within cultural context.
  `;

  const history = conversationHistory
    .map((m) => `${m.role === 'user' ? 'User' : 'Ancestor'}: ${m.content}`)
    .join('\n');

  return [base, ...details, culturalContext, instructions, 'Conversation history:', history].join('\n\n');
}
