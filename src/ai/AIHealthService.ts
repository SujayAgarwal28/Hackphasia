import OpenAI from 'openai';

// Types for AI medical analysis
export interface AITriageRequest {
  symptoms: string[];
  voiceTranscript?: string;
  bodyZones?: string[];
  painLevel?: number;
  duration?: string;
  demographics?: {
    age?: number;
    gender?: string;
    pregnancyStatus?: boolean;
    chronicConditions?: string[];
  };
  context?: {
    refugeeStatus: boolean;
    currentLocation?: string;
    accessToMedication?: boolean;
    traumaHistory?: boolean;
  };
}

export interface AITriageResponse {
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  confidence: number;
  primaryDiagnosis: {
    condition: string;
    probability: number;
    reasoning: string;
  };
  differentialDiagnoses: Array<{
    condition: string;
    probability: number;
    reasoning: string;
  }>;
  immediateActions: string[];
  whenToSeekCare: string;
  homeCareTips: string[];
  redFlags: string[];
  culturallySensitiveAdvice: string[];
  translatedOutput?: {
    [language: string]: Partial<AITriageResponse>;
  };
}

export interface AIConversationContext {
  sessionId: string;
  messageHistory: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }>;
  userProfile?: {
    preferredLanguage: string;
    culturalBackground?: string;
    medicalHistory?: string[];
  };
}

class AIHealthService {
  private openai: OpenAI;
  private readonly SYSTEM_PROMPT = `You are an advanced AI medical assistant specifically designed for refugee health support. Your expertise includes:

1. MEDICAL EXPERTISE:
   - Emergency triage and risk assessment
   - Trauma-informed care approaches
   - Infectious disease patterns in refugee populations
   - Mental health crisis recognition
   - Pediatric and maternal health in displacement settings

2. CULTURAL COMPETENCY:
   - Understanding of diverse cultural health beliefs
   - Sensitivity to trauma and displacement experiences
   - Awareness of language barriers and health literacy
   - Recognition of gender-specific health concerns in different cultures

3. RESOURCE CONSTRAINTS:
   - Assessment considering limited access to healthcare
   - Recommendations for resource-limited settings
   - Understanding of medication availability issues
   - Focus on preventive care and early intervention

4. COMMUNICATION PRINCIPLES:
   - Clear, simple language avoiding medical jargon
   - Empathetic and non-judgmental tone
   - Recognition of fear and mistrust of medical systems
   - Emphasis on dignity and respect

IMPORTANT GUIDELINES:
- Always err on the side of caution for serious symptoms
- Provide culturally sensitive recommendations
- Consider the unique stressors of displacement
- Emphasize when immediate medical attention is needed
- Offer practical solutions for resource-limited situations
- Be aware of potential trauma responses to medical discussions

FORMAT YOUR RESPONSES AS STRUCTURED JSON matching the AITriageResponse interface.`;

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey || apiKey.includes('your_openai')) {
      console.warn('OpenAI API key not configured. Using mock responses.');
      this.openai = null as any;
    } else {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
      });
    }
  }

  async performAITriage(request: AITriageRequest): Promise<AITriageResponse> {
    if (!this.openai) {
      return this.getMockAIResponse(request);
    }

    try {
      const prompt = this.buildTriagePrompt(request);
      
      const completion = await this.openai.chat.completions.create({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent medical advice
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');
      return this.validateAndEnhanceResponse(response, request);
      
    } catch (error) {
      console.error('AI Triage Error:', error);
      // Fallback to rule-based system
      return this.getFallbackResponse(request);
    }
  }

  async generateContextualAdvice(
    symptoms: string[],
    context: AIConversationContext
  ): Promise<string> {
    if (!this.openai) {
      return "I understand your concerns. Based on what you've shared, I recommend seeking medical attention for a proper evaluation.";
    }

    try {
      const conversationHistory = context.messageHistory
        .slice(-5) // Last 5 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const prompt = `
Context: This is an ongoing conversation with a refugee seeking health support.

Recent conversation:
${conversationHistory}

Current symptoms: ${symptoms.join(', ')}

Provide a compassionate, culturally sensitive response that:
1. Acknowledges their concerns
2. Provides practical next steps
3. Considers their refugee status and potential barriers
4. Offers reassurance while being medically appropriate
5. Suggests specific questions to ask healthcare providers

Response should be conversational, empathetic, and under 200 words.
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      return completion.choices[0].message.content || 
        "I understand you're going through a difficult time. Let's work together to address your health concerns.";
      
    } catch (error) {
      console.error('Contextual advice error:', error);
      return "I understand your concerns. Based on what you've shared, I recommend seeking medical attention for a proper evaluation.";
    }
  }

  async analyzeSymptomPatterns(
    symptomHistory: Array<{ symptoms: string[], timestamp: Date, severity: number }>
  ): Promise<{
    trends: string[];
    riskFactors: string[];
    recommendations: string[];
    urgencyChange: 'increasing' | 'stable' | 'decreasing';
  }> {
    // This would use ML models to analyze patterns
    if (!this.openai) {
      return {
        trends: ['Symptoms appear to be episodic'],
        riskFactors: ['Monitor for progression'],
        recommendations: ['Keep a detailed symptom diary', 'Schedule regular check-ups'],
        urgencyChange: 'stable'
      };
    }

    try {
      const prompt = `
Analyze this symptom pattern for a refugee patient:

Symptom History:
${symptomHistory.map((entry, i) => 
  `Day ${i + 1}: ${entry.symptoms.join(', ')} (Severity: ${entry.severity}/10) - ${entry.timestamp.toLocaleDateString()}`
).join('\n')}

Provide analysis of:
1. Temporal trends and patterns
2. Risk factors and warning signs
3. Specific recommendations for refugee health context
4. Whether urgency is increasing, stable, or decreasing

Format as JSON with trends, riskFactors, recommendations, and urgencyChange fields.
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
      
    } catch (error) {
      console.error('Pattern analysis error:', error);
      return {
        trends: ['Unable to analyze patterns at this time'],
        riskFactors: ['Please consult with healthcare provider'],
        recommendations: ['Continue monitoring symptoms'],
        urgencyChange: 'stable'
      };
    }
  }

  private buildTriagePrompt(request: AITriageRequest): string {
    return `
PATIENT PRESENTATION:
Symptoms: ${request.symptoms.join(', ')}
Voice Description: "${request.voiceTranscript || 'Not provided'}"
Body Areas Affected: ${request.bodyZones?.join(', ') || 'Not specified'}
Pain Level: ${request.painLevel ? `${request.painLevel}/10` : 'Not specified'}
Duration: ${request.duration || 'Not specified'}

PATIENT DEMOGRAPHICS:
Age: ${request.demographics?.age || 'Not specified'}
Gender: ${request.demographics?.gender || 'Not specified'}
Pregnancy Status: ${request.demographics?.pregnancyStatus ? 'Yes' : 'No/Unknown'}
Chronic Conditions: ${request.demographics?.chronicConditions?.join(', ') || 'None reported'}

CONTEXT:
Refugee Status: ${request.context?.refugeeStatus ? 'Yes' : 'No'}
Current Location: ${request.context?.currentLocation || 'Not specified'}
Access to Medication: ${request.context?.accessToMedication ? 'Yes' : 'Limited/No'}
Trauma History: ${request.context?.traumaHistory ? 'Yes' : 'Unknown'}

Please provide a comprehensive medical triage assessment considering the refugee context, cultural sensitivity, and resource limitations. Focus on immediate safety, practical recommendations, and when to escalate care.
    `;
  }

  private validateAndEnhanceResponse(response: any, request: AITriageRequest): AITriageResponse {
    // Ensure response has required fields with fallbacks
    return {
      urgencyLevel: response.urgencyLevel || 'medium',
      confidence: Math.min(Math.max(response.confidence || 0.7, 0), 1),
      primaryDiagnosis: response.primaryDiagnosis || {
        condition: 'Symptom complex requiring evaluation',
        probability: 0.7,
        reasoning: 'Multiple symptoms present requiring medical assessment'
      },
      differentialDiagnoses: response.differentialDiagnoses || [],
      immediateActions: response.immediateActions || ['Seek medical evaluation'],
      whenToSeekCare: response.whenToSeekCare || 'Within 24-48 hours or sooner if symptoms worsen',
      homeCareTips: response.homeCareTips || ['Rest', 'Stay hydrated', 'Monitor symptoms'],
      redFlags: response.redFlags || ['Worsening symptoms', 'High fever', 'Severe pain'],
      culturallySensitiveAdvice: response.culturallySensitiveAdvice || [
        'It is important to seek medical care when needed',
        'Your health and wellbeing matter'
      ]
    };
  }

  private getMockAIResponse(request: AITriageRequest): AITriageResponse {
    // Sophisticated mock response for demo purposes
    const hasHighRiskSymptoms = request.symptoms.some(s => 
      s.toLowerCase().includes('chest pain') || 
      s.toLowerCase().includes('difficulty breathing') ||
      s.toLowerCase().includes('severe')
    );

    return {
      urgencyLevel: hasHighRiskSymptoms ? 'high' : 'medium',
      confidence: 0.85,
      primaryDiagnosis: {
        condition: hasHighRiskSymptoms ? 'Acute condition requiring immediate attention' : 'Common symptom complex',
        probability: 0.75,
        reasoning: `Based on the combination of symptoms (${request.symptoms.join(', ')}), this presentation suggests ${hasHighRiskSymptoms ? 'a potentially serious condition' : 'a manageable health concern'} that would benefit from medical evaluation.`
      },
      differentialDiagnoses: [
        {
          condition: 'Viral infection',
          probability: 0.4,
          reasoning: 'Common presentation in refugee populations due to crowded living conditions'
        },
        {
          condition: 'Stress-related symptoms',
          probability: 0.3,
          reasoning: 'Displacement and trauma can manifest as physical symptoms'
        }
      ],
      immediateActions: hasHighRiskSymptoms 
        ? ['Seek immediate medical attention', 'Go to emergency room if available']
        : ['Monitor symptoms closely', 'Rest and hydration', 'Seek medical care within 24 hours'],
      whenToSeekCare: hasHighRiskSymptoms 
        ? 'Immediately - this requires urgent medical attention'
        : 'Within the next 24 hours, or sooner if symptoms worsen',
      homeCareTips: [
        'Maintain adequate hydration',
        'Get plenty of rest',
        'Eat nutritious foods if available',
        'Practice stress-reduction techniques'
      ],
      redFlags: [
        'Difficulty breathing or shortness of breath',
        'Chest pain or pressure',
        'High fever (over 38.5°C/101.3°F)',
        'Severe or worsening pain',
        'Signs of infection (redness, swelling, pus)'
      ],
      culturallySensitiveAdvice: [
        'Your health concerns are valid and important',
        'It is appropriate to seek medical care regardless of your legal status',
        'Many clinics provide confidential care for refugees and displaced persons',
        'Bringing a trusted friend or interpreter can help with communication'
      ]
    };
  }

  private getFallbackResponse(request: AITriageRequest): AITriageResponse {
    return this.getMockAIResponse(request);
  }
}

export default AIHealthService;