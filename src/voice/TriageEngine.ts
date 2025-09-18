// Symptom mapping and triage logic
import { SymptomMapping, TriageRule } from '../types';

export const symptomKeywords: SymptomMapping = {
  fever: {
    keywords: ['fever', 'hot', 'temperature', 'burning', 'feverish', 'heat'],
    bodyZones: ['head', 'chest'],
    urgency: 'medium',
    relatedSymptoms: ['headache', 'chills', 'fatigue']
  },
  headache: {
    keywords: ['headache', 'head pain', 'migraine', 'head hurt', 'skull pain'],
    bodyZones: ['head'],
    urgency: 'low',
    relatedSymptoms: ['fever', 'nausea', 'dizziness']
  },
  cough: {
    keywords: ['cough', 'coughing', 'hack', 'throat irritation'],
    bodyZones: ['chest', 'neck'],
    urgency: 'low',
    relatedSymptoms: ['fever', 'sore throat', 'shortness of breath']
  },
  'shortness of breath': {
    keywords: ['breathless', 'cant breathe', 'difficulty breathing', 'wheezing', 'gasping'],
    bodyZones: ['chest'],
    urgency: 'high',
    relatedSymptoms: ['chest pain', 'cough', 'dizziness']
  },
  'chest pain': {
    keywords: ['chest pain', 'heart pain', 'chest hurt', 'chest pressure'],
    bodyZones: ['chest'],
    urgency: 'high',
    relatedSymptoms: ['shortness of breath', 'nausea', 'sweating']
  },
  nausea: {
    keywords: ['nausea', 'sick', 'queasy', 'vomit', 'throw up'],
    bodyZones: ['abdomen'],
    urgency: 'low',
    relatedSymptoms: ['fever', 'headache', 'dizziness']
  },
  'abdominal pain': {
    keywords: ['stomach pain', 'belly pain', 'abdomen hurt', 'stomach ache'],
    bodyZones: ['abdomen'],
    urgency: 'medium',
    relatedSymptoms: ['nausea', 'fever', 'diarrhea']
  },
  dizziness: {
    keywords: ['dizzy', 'lightheaded', 'spinning', 'vertigo', 'faint'],
    bodyZones: ['head'],
    urgency: 'medium',
    relatedSymptoms: ['headache', 'nausea', 'fatigue']
  },
  fatigue: {
    keywords: ['tired', 'exhausted', 'weak', 'fatigue', 'no energy'],
    bodyZones: ['chest'],
    urgency: 'low',
    relatedSymptoms: ['fever', 'headache', 'muscle pain']
  },
  'muscle pain': {
    keywords: ['muscle pain', 'body ache', 'joint pain', 'sore muscles'],
    bodyZones: ['left-arm', 'right-arm', 'left-leg', 'right-leg', 'back'],
    urgency: 'low',
    relatedSymptoms: ['fatigue', 'fever', 'stiffness']
  }
};

export const triageRules: TriageRule[] = [
  {
    id: 'emergency-breathing',
    symptoms: ['shortness of breath', 'chest pain'],
    urgency: 'emergency',
    advice: 'EMERGENCY: Seek immediate medical attention. This could indicate a heart attack or serious breathing problem.',
    recommendedActions: [
      'Call emergency services immediately',
      'Sit upright in a comfortable position',
      'Loosen tight clothing',
      'If trained, consider aspirin for chest pain',
      'Stay calm and monitor breathing'
    ],
    redFlags: ['severe chest pain', 'cannot speak in full sentences', 'blue lips or fingernails']
  },
  {
    id: 'high-fever-breathing',
    symptoms: ['fever', 'shortness of breath', 'cough'],
    urgency: 'high',
    advice: 'High priority: This combination of symptoms requires medical evaluation within 4-6 hours.',
    recommendedActions: [
      'Contact healthcare provider or urgent care',
      'Monitor temperature regularly',
      'Stay hydrated',
      'Rest in upright position',
      'Isolate from others if possible'
    ]
  },
  {
    id: 'fever-headache',
    symptoms: ['fever', 'headache'],
    urgency: 'medium',
    advice: 'Monitor symptoms closely. Seek medical care if symptoms worsen or persist beyond 24-48 hours.',
    recommendedActions: [
      'Rest and stay hydrated',
      'Take fever-reducing medication as directed',
      'Monitor temperature every 4-6 hours',
      'Seek care if fever exceeds 103°F (39.4°C)',
      'Contact doctor if symptoms worsen'
    ]
  },
  {
    id: 'abdominal-nausea',
    symptoms: ['abdominal pain', 'nausea'],
    urgency: 'medium',
    advice: 'Abdominal symptoms require attention. Monitor for worsening and seek care if pain becomes severe.',
    recommendedActions: [
      'Avoid solid foods temporarily',
      'Stay hydrated with clear fluids',
      'Rest in comfortable position',
      'Seek care if pain becomes severe',
      'Monitor for fever or blood in vomit/stool'
    ]
  },
  {
    id: 'mild-symptoms',
    symptoms: ['headache'],
    urgency: 'low',
    advice: 'Common symptom that can often be managed at home. Monitor for changes.',
    recommendedActions: [
      'Rest in quiet, dark room',
      'Stay hydrated',
      'Apply cold or warm compress',
      'Consider over-the-counter pain relief',
      'Seek care if severe or persistent'
    ]
  },
  {
    id: 'muscle-fatigue',
    symptoms: ['muscle pain', 'fatigue'],
    urgency: 'low',
    advice: 'These symptoms often resolve with rest and self-care. Monitor for other developing symptoms.',
    recommendedActions: [
      'Get adequate rest and sleep',
      'Stay hydrated',
      'Gentle stretching or light movement',
      'Apply heat or cold to sore areas',
      'Contact doctor if symptoms persist beyond a week'
    ]
  }
];

export class TriageEngine {
  static analyzeSymptoms(detectedSymptoms: string[]): {
    urgency: 'low' | 'medium' | 'high' | 'emergency';
    advice: string;
    recommendedActions: string[];
    matchedRule?: TriageRule;
  } {
    // Find the most severe urgency level from individual symptoms
    let maxUrgency: 'low' | 'medium' | 'high' | 'emergency' = 'low';
    const urgencyLevels = { low: 1, medium: 2, high: 3, emergency: 4 };
    
    detectedSymptoms.forEach(symptom => {
      const mapping = symptomKeywords[symptom];
      if (mapping && urgencyLevels[mapping.urgency] > urgencyLevels[maxUrgency]) {
        maxUrgency = mapping.urgency;
      }
    });

    // Try to find a matching triage rule
    const matchedRule = triageRules.find(rule => 
      rule.symptoms.every(symptom => detectedSymptoms.includes(symptom))
    );

    if (matchedRule) {
      return {
        urgency: matchedRule.urgency,
        advice: matchedRule.advice,
        recommendedActions: matchedRule.recommendedActions,
        matchedRule
      };
    }

    // Fallback based on symptom severity
    return this.getDefaultAdvice(maxUrgency);
  }

  private static getDefaultAdvice(urgency: 'low' | 'medium' | 'high' | 'emergency') {
    const defaultAdvice = {
      emergency: {
        advice: 'EMERGENCY: Seek immediate medical attention.',
        recommendedActions: [
          'Call emergency services immediately',
          'Do not drive yourself to hospital',
          'Stay calm and follow emergency operator instructions'
        ]
      },
      high: {
        advice: 'High priority: Seek medical care within 4-6 hours.',
        recommendedActions: [
          'Contact your healthcare provider',
          'Consider urgent care or emergency room',
          'Monitor symptoms closely',
          'Do not delay seeking care'
        ]
      },
      medium: {
        advice: 'Monitor symptoms and seek medical care if they worsen or persist.',
        recommendedActions: [
          'Rest and stay hydrated',
          'Monitor symptoms for 24-48 hours',
          'Contact healthcare provider if no improvement',
          'Seek immediate care if symptoms worsen'
        ]
      },
      low: {
        advice: 'Common symptoms that can often be managed with self-care.',
        recommendedActions: [
          'Rest and stay hydrated',
          'Monitor symptoms',
          'Consider over-the-counter remedies',
          'Contact doctor if symptoms persist or worsen'
        ]
      }
    };

    return {
      urgency,
      ...defaultAdvice[urgency]
    };
  }

  static detectSymptoms(transcript: string): string[] {
    const lowerTranscript = transcript.toLowerCase();
    const detectedSymptoms: string[] = [];

    Object.entries(symptomKeywords).forEach(([symptom, mapping]) => {
      const isDetected = mapping.keywords.some(keyword => 
        lowerTranscript.includes(keyword.toLowerCase())
      );
      
      if (isDetected) {
        detectedSymptoms.push(symptom);
      }
    });

    return [...new Set(detectedSymptoms)]; // Remove duplicates
  }
}