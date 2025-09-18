// Advanced Multilingual AI Service for Real-time Translation and Cultural Context
// Using browser-based translation and cultural adaptation algorithms

export interface LanguageSupport {
  code: string;
  name: string;
  nativeName: string;
  prevalentRefugeePopulations: string[];
  culturalContext: {
    healthBeliefs: string[];
    communicationStyle: 'direct' | 'indirect' | 'high-context' | 'low-context';
    familyInvolvement: 'high' | 'medium' | 'low';
    genderConsiderations: string[];
    religiousConsiderations: string[];
  };
  commonHealthTerms: Record<string, string>;
  emergencyPhrases: Record<string, string>;
}

export interface TranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
  context: 'medical' | 'emergency' | 'general' | 'mental-health' | 'navigation';
  culturalAdaptation: boolean;
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  confidence: number;
  culturalNotes?: string[];
  alternativeTranslations?: string[];
  audioUrl?: string;
  culturalContext?: {
    communicationTips: string[];
    sensitiveTopics: string[];
    preferredApproach: string;
  };
}

export interface ConversationalAI {
  sessionId: string;
  userLanguage: string;
  aiLanguage: string;
  conversationHistory: Array<{
    role: 'user' | 'ai';
    message: string;
    translation?: string;
    timestamp: Date;
    culturalContext?: string;
  }>;
  culturalProfile: LanguageSupport['culturalContext'];
}

class MultilingualAIService {
  private readonly supportedLanguages: LanguageSupport[] = [
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      prevalentRefugeePopulations: ['Syria', 'Iraq', 'Yemen', 'Palestine'],
      culturalContext: {
        healthBeliefs: ['Traditional medicine valued', 'Family consultation important', 'Gender-specific care preferences'],
        communicationStyle: 'high-context',
        familyInvolvement: 'high',
        genderConsiderations: ['Same-gender healthcare preferred', 'Male family member involvement'],
        religiousConsiderations: ['Halal medications', 'Prayer times', 'Ramadan considerations']
      },
      commonHealthTerms: {
        'pain': 'ألم',
        'fever': 'حمى',
        'headache': 'صداع',
        'stomach': 'معدة',
        'medicine': 'دواء',
        'doctor': 'طبيب',
        'hospital': 'مستشفى'
      },
      emergencyPhrases: {
        'I need help': 'أحتاج المساعدة',
        'Call doctor': 'اتصل بالطبيب',
        'Emergency': 'طوارئ',
        'Pain here': 'ألم هنا'
      }
    },
    {
      code: 'fa',
      name: 'Persian/Farsi',
      nativeName: 'فارسی',
      prevalentRefugeePopulations: ['Afghanistan', 'Iran'],
      culturalContext: {
        healthBeliefs: ['Holistic health approach', 'Herbal remedies common', 'Family honor important'],
        communicationStyle: 'indirect',
        familyInvolvement: 'high',
        genderConsiderations: ['Female healthcare workers preferred', 'Modesty considerations'],
        religiousConsiderations: ['Islamic practices', 'Dietary restrictions', 'Prayer accommodations']
      },
      commonHealthTerms: {
        'pain': 'درد',
        'fever': 'تب',
        'headache': 'سردرد',
        'stomach': 'معده',
        'medicine': 'دارو',
        'doctor': 'دکتر',
        'hospital': 'بیمارستان'
      },
      emergencyPhrases: {
        'I need help': 'کمک می‌خواهم',
        'Call doctor': 'دکتر را صدا کنید',
        'Emergency': 'اورژانس',
        'Pain here': 'اینجا درد دارم'
      }
    },
    {
      code: 'so',
      name: 'Somali',
      nativeName: 'Soomaali',
      prevalentRefugeePopulations: ['Somalia', 'Somaliland'],
      culturalContext: {
        healthBeliefs: ['Community health emphasis', 'Traditional healing practices', 'Extended family involvement'],
        communicationStyle: 'high-context',
        familyInvolvement: 'high',
        genderConsiderations: ['Gender-matched care preferred', 'Family presence during treatment'],
        religiousConsiderations: ['Islamic guidelines', 'Halal requirements', 'Modest dress']
      },
      commonHealthTerms: {
        'pain': 'xanuun',
        'fever': 'qandho',
        'headache': 'madax xanuun',
        'stomach': 'calool',
        'medicine': 'dawo',
        'doctor': 'dhakhtar',
        'hospital': 'isbitaal'
      },
      emergencyPhrases: {
        'I need help': 'Waxaan u baahanahay caawimo',
        'Call doctor': 'U yeedh dhakhtarka',
        'Emergency': 'Degdeg',
        'Pain here': 'Xanuun halkan'
      }
    },
    {
      code: 'uk',
      name: 'Ukrainian',
      nativeName: 'Українська',
      prevalentRefugeePopulations: ['Ukraine'],
      culturalContext: {
        healthBeliefs: ['Scientific medicine trusted', 'Self-reliance valued', 'Professional healthcare expected'],
        communicationStyle: 'direct',
        familyInvolvement: 'medium',
        genderConsiderations: ['Professional boundaries respected', 'Equal treatment expected'],
        religiousConsiderations: ['Orthodox Christianity considerations', 'Flexible religious practices']
      },
      commonHealthTerms: {
        'pain': 'біль',
        'fever': 'гарячка',
        'headache': 'головний біль',
        'stomach': 'шлунок',
        'medicine': 'ліки',
        'doctor': 'лікар',
        'hospital': 'лікарня'
      },
      emergencyPhrases: {
        'I need help': 'Мені потрібна допомога',
        'Call doctor': 'Викличте лікаря',
        'Emergency': 'Екстрена ситуація',
        'Pain here': 'Тут болить'
      }
    }
  ];

  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      // In production, this would use Google Translate API
      // For now, we'll create sophisticated mock responses with cultural adaptation
      
      const sourceLanguage = this.supportedLanguages.find(lang => lang.code === request.fromLanguage);
      const targetLanguage = this.supportedLanguages.find(lang => lang.code === request.toLanguage);
      
      // Simulate translation with cultural context
      const culturallyAdaptedTranslation = await this.applyCulturalAdaptation(
        request.text,
        sourceLanguage,
        targetLanguage,
        request.context
      );

      return {
        originalText: request.text,
        translatedText: culturallyAdaptedTranslation.text,
        confidence: 0.92,
        culturalNotes: culturallyAdaptedTranslation.culturalNotes,
        alternativeTranslations: culturallyAdaptedTranslation.alternatives,
        culturalContext: culturallyAdaptedTranslation.culturalContext
      };
    } catch (error) {
      console.error('Translation error:', error);
      return {
        originalText: request.text,
        translatedText: 'Translation unavailable - emergency services: dial local emergency number',
        confidence: 0,
        culturalNotes: ['Translation service temporarily unavailable']
      };
    }
  }

  private async applyCulturalAdaptation(
    text: string,
    _sourceLanguage?: LanguageSupport,
    targetLanguage?: LanguageSupport,
    context?: string
  ) {
    // Advanced cultural adaptation algorithm
    const adaptations = {
      text: this.getContextualTranslation(text, targetLanguage, context),
      culturalNotes: [] as string[],
      alternatives: [] as string[],
      culturalContext: {
        communicationTips: [] as string[],
        sensitiveTopics: [] as string[],
        preferredApproach: ''
      }
    };

    if (targetLanguage) {
      // Add cultural communication tips
      if (targetLanguage.culturalContext.communicationStyle === 'indirect') {
        adaptations.culturalNotes.push('Communication style: Indirect approach preferred. Use polite, respectful language.');
        adaptations.culturalContext.communicationTips.push('Use gentle, non-confrontational language');
        adaptations.culturalContext.communicationTips.push('Allow time for family consultation');
      }

      if (targetLanguage.culturalContext.familyInvolvement === 'high') {
        adaptations.culturalNotes.push('Family involvement: Family members may need to be involved in health decisions.');
        adaptations.culturalContext.communicationTips.push('Include family members in health discussions');
        adaptations.culturalContext.communicationTips.push('Respect collective decision-making process');
      }

      // Gender considerations
      if (targetLanguage.culturalContext.genderConsiderations.length > 0) {
        adaptations.culturalNotes.push(`Gender considerations: ${targetLanguage.culturalContext.genderConsiderations.join(', ')}`);
      }

      // Religious considerations
      if (targetLanguage.culturalContext.religiousConsiderations.length > 0) {
        adaptations.culturalNotes.push(`Religious considerations: ${targetLanguage.culturalContext.religiousConsiderations.join(', ')}`);
      }

      // Context-specific adaptations
      if (context === 'medical') {
        adaptations.culturalContext.preferredApproach = 'Professional, respectful medical consultation with cultural sensitivity';
        adaptations.culturalContext.sensitiveTopics = ['Mental health stigma', 'Gender-specific conditions', 'Family planning'];
      } else if (context === 'emergency') {
        adaptations.culturalContext.preferredApproach = 'Direct, clear emergency communication with cultural awareness';
        adaptations.culturalContext.communicationTips.push('Use clear, simple language for urgency');
      }
    }

    return adaptations;
  }

  private getContextualTranslation(text: string, targetLanguage?: LanguageSupport, _context?: string): string {
    // Mock contextual translation based on cultural understanding
    if (!targetLanguage) return text;

    const lowerText = text.toLowerCase().trim();

    // Check for emergency phrases (exact matches first)
    const emergencyMatch = Object.entries(targetLanguage.emergencyPhrases).find(
      ([english, _]) => lowerText === english.toLowerCase()
    );
    if (emergencyMatch) {
      return emergencyMatch[1];
    }

    // Check for partial emergency phrase matches
    const partialEmergencyMatch = Object.entries(targetLanguage.emergencyPhrases).find(
      ([english, _]) => lowerText.includes(english.toLowerCase())
    );
    if (partialEmergencyMatch) {
      return text.replace(new RegExp(partialEmergencyMatch[0], 'gi'), partialEmergencyMatch[1]);
    }

    // Check for common health terms and replace them
    let translatedText = text;
    Object.entries(targetLanguage.commonHealthTerms).forEach(([english, translated]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translatedText = translatedText.replace(regex, translated);
    });

    // If we made any replacements, return the partially translated text
    if (translatedText !== text) {
      return translatedText;
    }

    // Common medical phrases translations by language
    const commonPhrases: {[key: string]: {[key: string]: string}} = {
      'ar': {
        "i don't understand": "لا أفهم",
        "i need help": "أحتاج مساعدة", 
        "i have pain here": "أشعر بألم هنا",
        "emergency": "طوارئ",
        "i need a doctor": "أحتاج طبيب",
        "where is the hospital": "أين المستشفى",
        "please help me": "من فضلك ساعدني",
        "i have fever": "أعاني من حمى"
      },
      'fa': {
        "i don't understand": "نمی‌فهمم",
        "i need help": "کمک می‌خواهم",
        "i have pain here": "اینجا درد دارم", 
        "emergency": "اورژانس",
        "i need a doctor": "دکتر می‌خواهم",
        "where is the hospital": "بیمارستان کجاست",
        "please help me": "لطفاً کمکم کنید",
        "i have fever": "تب دارم"
      },
      'so': {
        "i don't understand": "Ma fahmin",
        "i need help": "Waxaan u baahanahay caawimo",
        "i have pain here": "Xanuun halkan",
        "emergency": "Degdeg", 
        "i need a doctor": "Waxaan u baahanahay dhakhtar",
        "where is the hospital": "Xaggee ku taal isbitaalka",
        "please help me": "Fadlan i caawi",
        "i have fever": "Qandho ayaan qabaa"
      },
      'uk': {
        "i don't understand": "Я не розумію",
        "i need help": "Мені потрібна допомога",
        "i have pain here": "У мене тут болить",
        "emergency": "Невідкладна допомога",
        "i need a doctor": "Мені потрібен лікар", 
        "where is the hospital": "Де лікарня",
        "please help me": "Будь ласка, допоможіть мені",
        "i have fever": "У мене температура"
      }
    };

    // Check for exact phrase match
    const languagePhrases = commonPhrases[targetLanguage.code];
    if (languagePhrases) {
      const exactMatch = languagePhrases[lowerText];
      if (exactMatch) {
        return exactMatch;
      }
    }

    // Fallback: return original text (no translation available)
    return text;
  }

  async createConversationalSession(userLanguage: string): Promise<ConversationalAI> {
    const language = this.supportedLanguages.find(lang => lang.code === userLanguage);
    
    return {
      sessionId: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userLanguage,
      aiLanguage: 'en', // AI operates in English, translates responses
      conversationHistory: [],
      culturalProfile: language?.culturalContext || {
        healthBeliefs: [],
        communicationStyle: 'direct',
        familyInvolvement: 'medium',
        genderConsiderations: [],
        religiousConsiderations: []
      }
    };
  }

  async processMultilingualConversation(
    session: ConversationalAI,
    userMessage: string
  ): Promise<{
    aiResponse: string;
    translatedResponse: string;
    culturalGuidance: string[];
    updatedSession: ConversationalAI;
  }> {
    // Translate user message to English for AI processing
    const translatedUserMessage = await this.translateText({
      text: userMessage,
      fromLanguage: session.userLanguage,
      toLanguage: 'en',
      context: 'medical',
      culturalAdaptation: true
    });

    // Generate AI response (would integrate with GPT-4 here)
    const aiResponse = await this.generateCulturallyAwareResponse(
      translatedUserMessage.translatedText,
      session.culturalProfile
    );

    // Translate AI response back to user's language
    const translatedAIResponse = await this.translateText({
      text: aiResponse.response,
      fromLanguage: 'en',
      toLanguage: session.userLanguage,
      context: 'medical',
      culturalAdaptation: true
    });

    // Update conversation history
    const updatedSession = {
      ...session,
      conversationHistory: [
        ...session.conversationHistory,
        {
          role: 'user' as const,
          message: userMessage,
          translation: translatedUserMessage.translatedText,
          timestamp: new Date(),
          culturalContext: translatedUserMessage.culturalNotes?.join('; ')
        },
        {
          role: 'ai' as const,
          message: translatedAIResponse.translatedText,
          translation: aiResponse.response,
          timestamp: new Date(),
          culturalContext: aiResponse.culturalGuidance.join('; ')
        }
      ]
    };

    return {
      aiResponse: aiResponse.response,
      translatedResponse: translatedAIResponse.translatedText,
      culturalGuidance: [
        ...aiResponse.culturalGuidance,
        ...(translatedAIResponse.culturalNotes || [])
      ],
      updatedSession
    };
  }

  private async generateCulturallyAwareResponse(
    message: string,
    culturalProfile: LanguageSupport['culturalContext']
  ): Promise<{
    response: string;
    culturalGuidance: string[];
  }> {
    // This would integrate with GPT-4 in production
    // For now, generating contextually aware mock responses
    
    const culturalGuidance: string[] = [];
    let response = '';

    // Adapt response style based on cultural communication preferences
    if (culturalProfile.communicationStyle === 'indirect') {
      response = 'I understand your concern and would like to help you with this health matter. ';
      culturalGuidance.push('Using gentle, indirect communication style');
    } else if (culturalProfile.communicationStyle === 'direct') {
      response = 'Based on your symptoms, here is what I recommend: ';
      culturalGuidance.push('Using direct, clear communication style');
    }

    // Add family involvement considerations
    if (culturalProfile.familyInvolvement === 'high') {
      response += 'You may want to discuss this with your family members as well. ';
      culturalGuidance.push('Acknowledging importance of family consultation');
    }

    // Mock medical advice with cultural sensitivity
    if (message.toLowerCase().includes('pain')) {
      response += 'For pain management, I recommend consulting with a healthcare provider who can provide culturally appropriate treatment options. ';
      
      if (culturalProfile.religiousConsiderations.includes('Halal medications')) {
        response += 'Please ensure any medications are halal-certified if this is important to you. ';
        culturalGuidance.push('Considering halal medication requirements');
      }
    }

    // Gender considerations
    if (culturalProfile.genderConsiderations.includes('Same-gender healthcare preferred')) {
      response += 'If you prefer, I can help you find healthcare providers of your preferred gender. ';
      culturalGuidance.push('Offering gender-matched healthcare options');
    }

    return {
      response: response.trim(),
      culturalGuidance
    };
  }

  getSupportedLanguages(): LanguageSupport[] {
    return this.supportedLanguages;
  }

  getLanguageByCode(code: string): LanguageSupport | undefined {
    return this.supportedLanguages.find(lang => lang.code === code);
  }

  async generateVoiceSynthesis(text: string, language: string): Promise<string> {
    // In production, this would use Google Text-to-Speech or similar
    // For now, return a mock audio URL
    return `data:audio/wav;base64,mock_audio_for_${language}_${encodeURIComponent(text.substring(0, 20))}`;
  }
}

export const multilingualAI = new MultilingualAIService();