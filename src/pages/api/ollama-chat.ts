import { NextApiRequest, NextApiResponse } from 'next';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  ancestorPersona: {
    name: string;
    ethnicity: string;
    region: string;
    timePeriod: string;
    occupation: string;
    traits: string;
  };
  selectedHeritage: {
    ethnicity: string;
    region: string;
    timePeriod: string;
    relationship: string;
    occupation: string;
    traits: string;
  };
  userProfile?: {
    name: string;
    age?: number;
    location?: string;
    occupation?: string;
    personalBackground?: string;
    familyBackground?: string;
    culturalBackground?: string;
    languages?: string[];
  };
}

interface ChatResponse {
  message: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '', error: 'Method not allowed' });
  }

  try {
    const { messages, ancestorPersona, selectedHeritage, userProfile }: ChatRequest = req.body;

    if (!messages || !ancestorPersona || !selectedHeritage) {
      return res.status(400).json({ 
        message: '', 
        error: 'Missing required fields: messages, ancestorPersona, or selectedHeritage' 
      });
    }

    // Build user context if profile is available
    let userContext = '';
    if (userProfile) {
      const contextParts = [];
      
      if (userProfile.name) contextParts.push(`Your descendant's name is ${userProfile.name}`);
      if (userProfile.age) contextParts.push(`They are ${userProfile.age} years old`);
      if (userProfile.location) contextParts.push(`They currently live in ${userProfile.location}`);
      if (userProfile.occupation) contextParts.push(`They work as a ${userProfile.occupation}`);
      if (userProfile.personalBackground) contextParts.push(`About them: ${userProfile.personalBackground}`);
      if (userProfile.familyBackground) contextParts.push(`Their family background: ${userProfile.familyBackground}`);
      if (userProfile.culturalBackground) contextParts.push(`Their cultural background: ${userProfile.culturalBackground}`);
      if (userProfile.languages && userProfile.languages.length > 0) {
        contextParts.push(`They speak: ${userProfile.languages.join(', ')}`);
      }
      
      if (contextParts.length > 0) {
        userContext = `\n\nKnow about your descendant:\n${contextParts.join('\n')}\n\nUse this information naturally in conversation to be more personal and relatable. You might reference their life, ask about their work, mention shared cultural elements, or draw connections between your time and theirs.`;
      }
    }

    // Build system prompt for ancestor persona
    const systemPrompt = `You are ${ancestorPersona.name}, a ${selectedHeritage.ethnicity} ancestor from ${selectedHeritage.region} during the ${selectedHeritage.timePeriod}. You worked as a ${selectedHeritage.occupation}.

Your personality traits: ${selectedHeritage.traits}

You are speaking with your descendant across generations. Respond authentically as this ancestor would, incorporating:
- Cultural wisdom and sayings from ${selectedHeritage.ethnicity} heritage
- Historical context from ${selectedHeritage.timePeriod}
- Life experiences as a ${selectedHeritage.occupation}
- Traditional values and family-centered worldview
- Occasional use of Chinese phrases with translations when appropriate

Keep responses warm, wise, and culturally authentic. Address your descendant with terms of endearment like "my child", "little one", or "dear one".${userContext}`;

    // Prepare messages for Ollama
    const ollamaMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Call Ollama API
    const ollamaResponse = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen2.5:7b',
        messages: ollamaMessages,
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
          max_tokens: 500
        }
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status} ${ollamaResponse.statusText}`);
    }

    const ollamaData = await ollamaResponse.json();
    
    if (!ollamaData.message || !ollamaData.message.content) {
      throw new Error('Invalid response from Ollama API');
    }

    return res.status(200).json({
      message: ollamaData.message.content
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return appropriate error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return res.status(500).json({
      message: '',
      error: `Failed to generate response: ${errorMessage}`
    });
  }
}