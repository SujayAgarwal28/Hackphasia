import AIHealthService, { AITriageRequest, AITriageResponse, AIConversationContext } from '../ai/AIHealthService';
import { VoiceInput, UserTriageSummary } from '../types';

export interface SmartTriageSession {
  id: string;
  startTime: Date;
  voiceInputs: VoiceInput[];
  bodyMapping?: {
    zones: string[];
    painLevels: { [zone: string]: number };
  };
  aiAnalysis?: AITriageResponse;
  conversationContext: AIConversationContext;
  followUpQuestions: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    confidence: number;
  };
}

export interface SmartTriageQuestion {
  id: string;
  question: string;
  type: 'boolean' | 'scale' | 'multiple-choice' | 'open-text';
  options?: string[];
  required: boolean;
  reasoning: string;
  followUpTriggers?: {
    answer: any;
    nextQuestions: string[];
  }[];
}

class SmartTriageEngine {
  private aiService: AIHealthService;
  private currentSession: SmartTriageSession | null = null;
  
  constructor() {
    this.aiService = new AIHealthService();
  }

  async startNewSession(): Promise<SmartTriageSession> {
    this.currentSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date(),
      voiceInputs: [],
      conversationContext: {
        sessionId: `session_${Date.now()}`,
        messageHistory: [{
          role: 'system',
          content: 'Starting new health assessment session.',
          timestamp: new Date()
        }]
      },
      followUpQuestions: [],
      riskAssessment: {
        level: 'low',
        factors: [],
        confidence: 0.5
      }
    };

    return this.currentSession;
  }

  async processVoiceInput(
    voiceInput: VoiceInput,
    additionalContext?: {
      bodyZones?: string[];
      painLevel?: number;
      demographics?: any;
    }
  ): Promise<{
    aiAnalysis: AITriageResponse;
    followUpQuestions: SmartTriageQuestion[];
    recommendedActions: string[];
  }> {
    if (!this.currentSession) {
      await this.startNewSession();
    }

    // Add voice input to session
    this.currentSession!.voiceInputs.push(voiceInput);
    
    // Add to conversation context
    this.currentSession!.conversationContext.messageHistory.push({
      role: 'user',
      content: voiceInput.transcript,
      timestamp: new Date()
    });

    // Extract symptoms from all voice inputs
    const allSymptoms = this.extractSymptomsFromVoice(this.currentSession!.voiceInputs);
    
    // Build AI triage request
    const triageRequest: AITriageRequest = {
      symptoms: allSymptoms,
      voiceTranscript: voiceInput.transcript,
      bodyZones: additionalContext?.bodyZones,
      painLevel: additionalContext?.painLevel,
      demographics: additionalContext?.demographics,
      context: {
        refugeeStatus: true, // Default assumption for this app
        traumaHistory: this.detectTraumaIndicators(voiceInput.transcript)
      }
    };

    // Get AI analysis
    const aiAnalysis = await this.aiService.performAITriage(triageRequest);
    this.currentSession!.aiAnalysis = aiAnalysis;

    // Generate intelligent follow-up questions
    const followUpQuestions = await this.generateFollowUpQuestions(aiAnalysis, voiceInput);

    // Update risk assessment
    this.updateRiskAssessment(aiAnalysis);

    // Generate contextual advice
    const contextualAdvice = await this.aiService.generateContextualAdvice(
      allSymptoms,
      this.currentSession!.conversationContext
    );

    // Add AI response to conversation
    this.currentSession!.conversationContext.messageHistory.push({
      role: 'assistant',
      content: contextualAdvice,
      timestamp: new Date()
    });

    return {
      aiAnalysis,
      followUpQuestions,
      recommendedActions: aiAnalysis.immediateActions
    };
  }

  async answerFollowUpQuestion(
    questionId: string,
    answer: any
  ): Promise<{
    updatedAnalysis?: AITriageResponse;
    nextQuestions: SmartTriageQuestion[];
  }> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    // Record the answer
    this.currentSession.conversationContext.messageHistory.push({
      role: 'user',
      content: `Question ${questionId}: ${JSON.stringify(answer)}`,
      timestamp: new Date()
    });

    // Re-analyze with new information
    const updatedRequest: AITriageRequest = {
      symptoms: this.extractSymptomsFromVoice(this.currentSession.voiceInputs),
      voiceTranscript: this.currentSession.voiceInputs.map(vi => vi.transcript).join(' '),
      bodyZones: this.currentSession.bodyMapping?.zones,
      context: {
        refugeeStatus: true,
        traumaHistory: this.detectTraumaFromHistory()
      }
    };

    const updatedAnalysis = await this.aiService.performAITriage(updatedRequest);
    this.currentSession.aiAnalysis = updatedAnalysis;

    // Generate next questions based on the answer
    const nextQuestions = await this.generateAdaptiveQuestions(questionId, answer, updatedAnalysis);

    return {
      updatedAnalysis,
      nextQuestions
    };
  }

  async analyzeSympomTrends(): Promise<{
    trends: string[];
    riskFactors: string[];
    recommendations: string[];
    urgencyChange: 'increasing' | 'stable' | 'decreasing';
  }> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    // Mock symptom history for demo
    const symptomHistory = this.currentSession.voiceInputs.map((input, index) => ({
      symptoms: this.extractSymptomsFromVoice([input]),
      timestamp: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Spread over days
      severity: Math.floor(Math.random() * 10) + 1
    }));

    return await this.aiService.analyzeSymptomPatterns(symptomHistory);
  }

  private extractSymptomsFromVoice(voiceInputs: VoiceInput[]): string[] {
    const allText = voiceInputs.map(vi => vi.transcript.toLowerCase()).join(' ');
    
    // Advanced symptom extraction using NLP-like pattern matching
    const symptomPatterns = {
      pain: /\b(pain|hurt|ache|aching|sore|tender|throbbing|sharp|burning|stabbing)\b/g,
      fever: /\b(fever|hot|burning up|temperature|chills|sweating)\b/g,
      headache: /\b(headache|head\s+pain|migraine|head\s+hurt)\b/g,
      nausea: /\b(nausea|sick|vomit|throw\s+up|queasy|stomach)\b/g,
      fatigue: /\b(tired|exhausted|fatigue|weak|weakness|energy)\b/g,
      breathing: /\b(breath|breathing|shortness|wheez|cough|chest\s+tight)\b/g,
      dizziness: /\b(dizzy|lightheaded|faint|balance|spinning)\b/g,
      sleep: /\b(sleep|insomnia|can't\s+sleep|nightmares|restless)\b/g,
      anxiety: /\b(anxiety|anxious|worry|nervous|panic|stress|afraid)\b/g,
      mood: /\b(sad|depressed|hopeless|angry|irritable|mood)\b/g
    };

    const detectedSymptoms: string[] = [];
    
    Object.entries(symptomPatterns).forEach(([symptom, pattern]) => {
      if (pattern.test(allText)) {
        detectedSymptoms.push(symptom);
      }
    });

    // Also extract direct mentions
    const directSymptoms = allText.match(/\b(symptom|feel|have|experiencing)\s+([a-z\s]+)/g) || [];
    
    return [...new Set([...detectedSymptoms, ...directSymptoms])];
  }

  private detectTraumaIndicators(transcript: string): boolean {
    const traumaKeywords = [
      'nightmare', 'flashback', 'scared', 'afraid', 'violence', 'war',
      'escape', 'flee', 'attack', 'bomb', 'explosion', 'shooting',
      'persecution', 'torture', 'threat', 'danger', 'safe', 'unsafe'
    ];

    return traumaKeywords.some(keyword => 
      transcript.toLowerCase().includes(keyword)
    );
  }

  private detectTraumaFromHistory(): boolean {
    if (!this.currentSession) return false;
    
    return this.currentSession.voiceInputs.some(input => 
      this.detectTraumaIndicators(input.transcript)
    );
  }

  private async generateFollowUpQuestions(
    aiAnalysis: AITriageResponse, 
    voiceInput: VoiceInput
  ): Promise<SmartTriageQuestion[]> {
    const questions: SmartTriageQuestion[] = [];

    // Generate questions based on urgency level
    if (aiAnalysis.urgencyLevel === 'high' || aiAnalysis.urgencyLevel === 'emergency') {
      questions.push({
        id: 'emergency_transport',
        question: 'Do you have a way to get to a hospital or emergency care right now?',
        type: 'boolean',
        required: true,
        reasoning: 'Critical for emergency situations to ensure patient can access care'
      });
    }

    // Questions based on symptoms mentioned
    if (voiceInput.transcript.toLowerCase().includes('pain')) {
      questions.push({
        id: 'pain_scale',
        question: 'On a scale of 1-10, how would you rate your pain right now?',
        type: 'scale',
        required: true,
        reasoning: 'Pain assessment is crucial for determining appropriate care level'
      });

      questions.push({
        id: 'pain_duration',
        question: 'How long have you been experiencing this pain?',
        type: 'multiple-choice',
        options: ['Less than 1 hour', '1-6 hours', '6-24 hours', '1-7 days', 'More than a week'],
        required: true,
        reasoning: 'Duration helps differentiate acute vs chronic conditions'
      });
    }

    // Refugee-specific questions
    questions.push({
      id: 'medication_access',
      question: 'Do you currently have access to any medications or medical supplies?',
      type: 'boolean',
      required: false,
      reasoning: 'Important for refugees who may have limited access to healthcare resources'
    });

    if (this.detectTraumaFromHistory()) {
      questions.push({
        id: 'trauma_symptoms',
        question: 'Are you experiencing any nightmares, flashbacks, or feeling very anxious?',
        type: 'boolean',
        required: false,
        reasoning: 'Trauma screening is important for refugee populations'
      });
    }

    return questions.slice(0, 3); // Limit to 3 questions to avoid overwhelming
  }

  private async generateAdaptiveQuestions(
    answeredQuestionId: string,
    answer: any,
    _currentAnalysis: AITriageResponse
  ): Promise<SmartTriageQuestion[]> {
    const questions: SmartTriageQuestion[] = [];

    // Adaptive questioning based on previous answers
    if (answeredQuestionId === 'pain_scale' && answer >= 7) {
      questions.push({
        id: 'severe_pain_location',
        question: 'Can you describe exactly where the severe pain is located?',
        type: 'open-text',
        required: true,
        reasoning: 'Severe pain requires precise localization for proper care'
      });
    }

    if (answeredQuestionId === 'medication_access' && answer === false) {
      questions.push({
        id: 'nearest_clinic',
        question: 'Do you know the location of the nearest clinic or hospital?',
        type: 'boolean',
        required: false,
        reasoning: 'Helps determine if navigation assistance is needed'
      });
    }

    return questions;
  }

  private updateRiskAssessment(aiAnalysis: AITriageResponse): void {
    if (!this.currentSession) return;

    const urgencyToRisk = {
      'low': 'low' as const,
      'medium': 'medium' as const,
      'high': 'high' as const,
      'emergency': 'critical' as const
    };

    this.currentSession.riskAssessment = {
      level: urgencyToRisk[aiAnalysis.urgencyLevel],
      factors: [
        ...aiAnalysis.redFlags,
        ...(this.detectTraumaFromHistory() ? ['Trauma history detected'] : [])
      ],
      confidence: aiAnalysis.confidence
    };
  }

  getCurrentSession(): SmartTriageSession | null {
    return this.currentSession;
  }

  async generateSummaryReport(): Promise<UserTriageSummary> {
    if (!this.currentSession || !this.currentSession.aiAnalysis) {
      throw new Error('No completed analysis available');
    }

    const analysis = this.currentSession.aiAnalysis;
    
    return {
      id: this.currentSession.id,
      userId: 'current_user', // Would be actual user ID in production
      symptoms: this.extractSymptomsFromVoice(this.currentSession.voiceInputs),
      bodyZones: this.currentSession.bodyMapping?.zones || [],
      urgency: analysis.urgencyLevel,
      advice: `Primary Assessment: ${analysis.primaryDiagnosis.condition}. ${analysis.primaryDiagnosis.reasoning}`,
      recommendedActions: analysis.immediateActions,
      nearestClinic: undefined, // Would be populated with actual clinic data
      createdAt: this.currentSession.startTime.toISOString(),
      language: 'en' // Would be detected from voice input
    };
  }
}

export default SmartTriageEngine;