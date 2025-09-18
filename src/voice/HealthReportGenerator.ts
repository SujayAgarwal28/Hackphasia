import { PainAssessment } from './BodyMapper';

export interface ComprehensiveReport {
  id: string;
  patientId: string;
  assessmentDate: string;
  painAssessments: PainAssessment[];
  overallPainScore: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  recommendations: {
    exercises: ExerciseRecommendation[];
    lifestyle: string[];
    medicalAdvice: string[];
    followUp: FollowUpRecommendation;
  };
  riskFactors: string[];
  redFlags: string[];
}

export interface ExerciseRecommendation {
  name: string;
  description: string;
  duration: string;
  frequency: string;
  instructions: string[];
  precautions: string[];
  targetBodyParts: string[];
}

export interface FollowUpRecommendation {
  timeFrame: string;
  conditions: string[];
  urgentSigns: string[];
  recommendedSpecialist?: string;
}

export class HealthReportGenerator {
  static generateComprehensiveReport(painAssessments: PainAssessment[]): ComprehensiveReport {
    const reportId = this.generateReportId();
    const overallPainScore = this.calculateOverallPainScore(painAssessments);
    const urgencyLevel = this.determineUrgencyLevel(painAssessments);
    const riskFactors = this.identifyRiskFactors(painAssessments);
    const redFlags = this.identifyRedFlags(painAssessments);
    
    return {
      id: reportId,
      patientId: 'anonymous',
      assessmentDate: new Date().toISOString(),
      painAssessments,
      overallPainScore,
      urgencyLevel,
      recommendations: {
        exercises: this.generateExerciseRecommendations(painAssessments),
        lifestyle: this.generateLifestyleRecommendations(painAssessments),
        medicalAdvice: this.generateMedicalAdvice(painAssessments, urgencyLevel),
        followUp: this.generateFollowUpRecommendations(painAssessments, urgencyLevel)
      },
      riskFactors,
      redFlags
    };
  }

  private static generateReportId(): string {
    return `HR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private static calculateOverallPainScore(assessments: PainAssessment[]): number {
    if (assessments.length === 0) return 0;
    
    const totalScore = assessments.reduce((sum, assessment) => sum + assessment.painLevel, 0);
    const averageScore = totalScore / assessments.length;
    
    // Weight by number of affected regions
    const regionMultiplier = Math.min(1 + (assessments.length - 1) * 0.1, 1.5);
    
    return Math.min(Math.round(averageScore * regionMultiplier * 10) / 10, 10);
  }

  private static determineUrgencyLevel(assessments: PainAssessment[]): ComprehensiveReport['urgencyLevel'] {
    const maxPainLevel = Math.max(...assessments.map(a => a.painLevel));
    const hasRedFlags = this.identifyRedFlags(assessments).length > 0;
    const multipleHighPainAreas = assessments.filter(a => a.painLevel >= 7).length >= 2;
    
    if (hasRedFlags || maxPainLevel >= 9) return 'emergency';
    if (maxPainLevel >= 7 || multipleHighPainAreas) return 'high';
    if (maxPainLevel >= 5 || assessments.length >= 3) return 'medium';
    return 'low';
  }

  private static identifyRiskFactors(assessments: PainAssessment[]): string[] {
    const factors: string[] = [];
    
    // Check for multiple pain areas
    if (assessments.length >= 3) {
      factors.push('Multiple pain locations may indicate systemic condition');
    }
    
    // Check for chronic pain indicators
    const chronicPain = assessments.some(a => 
      ['weeks', 'months'].includes(a.duration)
    );
    if (chronicPain) {
      factors.push('Chronic pain patterns detected');
    }
    
    // Check for high-intensity pain
    const severePain = assessments.some(a => a.painLevel >= 8);
    if (severePain) {
      factors.push('High-intensity pain requires medical evaluation');
    }
    
    // Check for specific pain types
    const neuropathicPain = assessments.some(a => 
      ['burning', 'stabbing'].includes(a.type)
    );
    if (neuropathicPain) {
      factors.push('Neuropathic pain characteristics present');
    }
    
    return factors;
  }

  private static identifyRedFlags(assessments: PainAssessment[]): string[] {
    const redFlags: string[] = [];
    
    assessments.forEach(assessment => {
      const region = assessment.region;
      
      // Check for emergency signs based on region and urgency factors
      if (assessment.painLevel >= 8) {
        region.urgencyFactors.forEach(factor => {
          if (!redFlags.includes(factor)) {
            redFlags.push(factor);
          }
        });
      }
      
      // Specific red flags based on body region
      if (region.anatomicalPart === 'Chest' && assessment.painLevel >= 7) {
        redFlags.push('Severe chest pain - possible cardiac emergency');
      }
      
      if (region.anatomicalPart === 'Head' && assessment.painLevel >= 8) {
        redFlags.push('Severe headache - possible neurological emergency');
      }
      
      if (region.anatomicalPart === 'Abdomen' && assessment.painLevel >= 7) {
        redFlags.push('Severe abdominal pain - possible surgical emergency');
      }
      
      if (region.anatomicalPart === 'Back' && assessment.painLevel >= 8) {
        redFlags.push('Severe back pain - possible spinal emergency');
      }
    });
    
    return redFlags;
  }

  private static generateExerciseRecommendations(assessments: PainAssessment[]): ExerciseRecommendation[] {
    const exercises: ExerciseRecommendation[] = [];
    const addedExercises = new Set<string>();
    
    assessments.forEach(assessment => {
      assessment.region.exerciseRecommendations.forEach(exerciseName => {
        if (!addedExercises.has(exerciseName)) {
          addedExercises.add(exerciseName);
          exercises.push(this.getDetailedExercise(exerciseName, assessment.region.anatomicalPart));
        }
      });
    });
    
    // Add general exercises for overall wellness
    if (assessments.length >= 2) {
      exercises.push(this.getDetailedExercise('gentle walking', 'General'));
      exercises.push(this.getDetailedExercise('deep breathing', 'General'));
    }
    
    return exercises;
  }

  private static getDetailedExercise(exerciseName: string, bodyPart: string): ExerciseRecommendation {
    const exerciseDatabase: { [key: string]: ExerciseRecommendation } = {
      'neck stretches': {
        name: 'Neck Stretches',
        description: 'Gentle stretches to relieve neck tension and improve mobility',
        duration: '30 seconds per stretch',
        frequency: '3-4 times per day',
        instructions: [
          'Sit or stand with good posture',
          'Slowly tilt your head to the right, bringing ear toward shoulder',
          'Hold for 30 seconds, return to center',
          'Repeat on the left side',
          'Gently look up and down, hold each position'
        ],
        precautions: ['Stop if pain increases', 'Move slowly and gently', 'Avoid forcing movements'],
        targetBodyParts: ['Neck', 'Upper shoulders']
      },
      'shoulder rolls': {
        name: 'Shoulder Rolls',
        description: 'Circular movements to improve shoulder mobility and reduce tension',
        duration: '10-15 rolls each direction',
        frequency: '2-3 times per day',
        instructions: [
          'Stand with arms at your sides',
          'Slowly roll shoulders backward in a circular motion',
          'Complete 10-15 rolls backward',
          'Repeat rolling forward',
          'Focus on smooth, controlled movements'
        ],
        precautions: ['Stop if sharp pain occurs', 'Start with small movements'],
        targetBodyParts: ['Shoulders', 'Upper back']
      },
      'back stretches': {
        name: 'Back Stretches',
        description: 'Gentle stretches to relieve back tension and improve flexibility',
        duration: '30-60 seconds per stretch',
        frequency: '2-3 times per day',
        instructions: [
          'Lie on your back with knees bent',
          'Bring one knee to chest, hold for 30 seconds',
          'Repeat with other knee',
          'Bring both knees to chest',
          'Gently rock side to side'
        ],
        precautions: ['Stop if pain radiates down legs', 'Move slowly', 'Support your head'],
        targetBodyParts: ['Lower back', 'Hip flexors']
      },
      'deep breathing': {
        name: 'Deep Breathing Exercise',
        description: 'Breathing technique to reduce stress and muscle tension',
        duration: '5-10 minutes',
        frequency: '3-4 times per day',
        instructions: [
          'Sit comfortably with back straight',
          'Place one hand on chest, one on belly',
          'Breathe in slowly through nose for 4 counts',
          'Hold breath for 2 counts',
          'Exhale slowly through mouth for 6 counts',
          'Focus on belly hand moving more than chest hand'
        ],
        precautions: ['Stop if feeling dizzy', 'Practice in comfortable position'],
        targetBodyParts: ['Respiratory system', 'General relaxation']
      },
      'gentle walking': {
        name: 'Gentle Walking',
        description: 'Low-impact exercise to improve circulation and reduce stiffness',
        duration: '10-30 minutes',
        frequency: 'Daily',
        instructions: [
          'Start with 5-10 minutes if new to exercise',
          'Maintain comfortable pace - you should be able to talk',
          'Wear supportive, comfortable shoes',
          'Choose flat, even surfaces',
          'Gradually increase duration as tolerated'
        ],
        precautions: ['Stop if chest pain or severe shortness of breath', 'Stay hydrated'],
        targetBodyParts: ['Full body', 'Cardiovascular system']
      }
    };
    
    return exerciseDatabase[exerciseName] || {
      name: exerciseName,
      description: `Recommended exercise for ${bodyPart}`,
      duration: '15-30 seconds',
      frequency: '2-3 times per day',
      instructions: ['Perform gently and slowly', 'Stop if pain increases'],
      precautions: ['Consult healthcare provider if unsure'],
      targetBodyParts: [bodyPart]
    };
  }

  private static generateLifestyleRecommendations(assessments: PainAssessment[]): string[] {
    const recommendations: string[] = [];
    
    // General recommendations
    recommendations.push('Maintain good posture throughout the day');
    recommendations.push('Stay hydrated - aim for 8 glasses of water daily');
    recommendations.push('Get adequate sleep (7-9 hours) for tissue repair');
    
    // Pain-specific recommendations
    const hasMuscularPain = assessments.some(a => 
      ['Back', 'Shoulder', 'Arm', 'Leg'].includes(a.region.anatomicalPart)
    );
    if (hasMuscularPain) {
      recommendations.push('Apply heat therapy for muscle tension (15-20 minutes)');
      recommendations.push('Consider gentle massage or self-massage techniques');
    }
    
    const hasInflammation = assessments.some(a => a.painLevel >= 6);
    if (hasInflammation) {
      recommendations.push('Apply ice for acute pain and swelling (15-20 minutes)');
      recommendations.push('Avoid activities that worsen pain');
    }
    
    const hasChronicPain = assessments.some(a => 
      ['weeks', 'months'].includes(a.duration)
    );
    if (hasChronicPain) {
      recommendations.push('Consider stress management techniques (meditation, yoga)');
      recommendations.push('Maintain a pain diary to identify triggers');
    }
    
    return recommendations;
  }

  private static generateMedicalAdvice(
    assessments: PainAssessment[], 
    urgencyLevel: ComprehensiveReport['urgencyLevel']
  ): string[] {
    const advice: string[] = [];
    
    switch (urgencyLevel) {
      case 'emergency':
        advice.push('🚨 SEEK IMMEDIATE MEDICAL ATTENTION');
        advice.push('Go to emergency room or call emergency services');
        advice.push('Do not delay medical care');
        break;
        
      case 'high':
        advice.push('Schedule urgent appointment with healthcare provider within 24-48 hours');
        advice.push('Monitor symptoms closely for any worsening');
        advice.push('Consider urgent care if primary doctor unavailable');
        break;
        
      case 'medium':
        advice.push('Schedule appointment with healthcare provider within 1-2 weeks');
        advice.push('Monitor symptoms and seek earlier care if worsening');
        advice.push('Over-the-counter pain relief may be appropriate (follow package instructions)');
        break;
        
      case 'low':
        advice.push('Monitor symptoms for 2-3 days');
        advice.push('Try conservative measures (rest, gentle movement, heat/ice)');
        advice.push('Schedule routine appointment if symptoms persist beyond a week');
        break;
    }
    
    // Additional specific advice based on affected regions
    const affectedParts = [...new Set(assessments.map(a => a.region.anatomicalPart))];
    
    if (affectedParts.includes('Back')) {
      advice.push('Avoid prolonged bed rest - gentle movement is usually better');
    }
    
    if (affectedParts.includes('Head')) {
      advice.push('Keep a headache diary to identify potential triggers');
    }
    
    if (affectedParts.includes('Chest')) {
      advice.push('Seek immediate care for any chest pain with shortness of breath');
    }
    
    return advice;
  }

  private static generateFollowUpRecommendations(
    assessments: PainAssessment[], 
    urgencyLevel: ComprehensiveReport['urgencyLevel']
  ): FollowUpRecommendation {
    const baseRecommendation: FollowUpRecommendation = {
      timeFrame: '',
      conditions: [],
      urgentSigns: [
        'Sudden worsening of pain',
        'New neurological symptoms (numbness, weakness)',
        'Fever with pain',
        'Loss of bowel or bladder control',
        'Severe breathing difficulty'
      ]
    };
    
    switch (urgencyLevel) {
      case 'emergency':
        return {
          ...baseRecommendation,
          timeFrame: 'Immediate medical care required',
          conditions: ['Any change in condition'],
          recommendedSpecialist: 'Emergency Medicine'
        };
        
      case 'high':
        return {
          ...baseRecommendation,
          timeFrame: 'Follow up within 24-48 hours',
          conditions: ['If pain not improving', 'If new symptoms develop'],
          recommendedSpecialist: 'Primary Care Physician or Specialist'
        };
        
      case 'medium':
        return {
          ...baseRecommendation,
          timeFrame: 'Follow up in 1-2 weeks if symptoms persist',
          conditions: ['If conservative measures ineffective', 'If pain interferes with daily activities'],
          recommendedSpecialist: 'Primary Care Physician'
        };
        
      case 'low':
        return {
          ...baseRecommendation,
          timeFrame: 'Follow up if symptoms persist beyond 1 week',
          conditions: ['If self-care measures ineffective', 'If pain worsens'],
          recommendedSpecialist: 'Primary Care Physician if needed'
        };
    }
  }

  static formatReportForPrint(report: ComprehensiveReport): string {
    const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString();
    
    return `
🏥 COMPREHENSIVE HEALTH ASSESSMENT REPORT
═══════════════════════════════════════════════════════════

📋 ASSESSMENT SUMMARY
Report ID: ${report.id}
Date: ${formatDate(report.assessmentDate)}
Overall Pain Score: ${report.overallPainScore}/10
Urgency Level: ${report.urgencyLevel.toUpperCase()}

🎯 PAIN ASSESSMENT DETAILS
${report.painAssessments.map((assessment, index) => `
${index + 1}. ${assessment.region.name} (${assessment.region.anatomicalPart})
   • Pain Level: ${assessment.painLevel}/10
   • Type: ${assessment.type}
   • Duration: ${assessment.duration}
   • Description: ${assessment.description || 'None provided'}
`).join('')}

🚨 RISK FACTORS & RED FLAGS
${report.riskFactors.length > 0 ? 
  `Risk Factors:\n${report.riskFactors.map(factor => `• ${factor}`).join('\n')}` : 
  'No significant risk factors identified.'
}

${report.redFlags.length > 0 ? 
  `🚨 RED FLAGS - URGENT ATTENTION NEEDED:\n${report.redFlags.map(flag => `• ${flag}`).join('\n')}` : 
  'No red flags identified.'
}

💊 MEDICAL RECOMMENDATIONS
${report.recommendations.medicalAdvice.map(advice => `• ${advice}`).join('\n')}

🏃‍♂️ EXERCISE RECOMMENDATIONS
${report.recommendations.exercises.map(exercise => `
${exercise.name}:
• Description: ${exercise.description}
• Duration: ${exercise.duration}
• Frequency: ${exercise.frequency}
• Target Areas: ${exercise.targetBodyParts.join(', ')}
• Key Instructions: ${exercise.instructions.slice(0, 2).join('; ')}
• Precautions: ${exercise.precautions.join('; ')}
`).join('')}

🏠 LIFESTYLE RECOMMENDATIONS
${report.recommendations.lifestyle.map(rec => `• ${rec}`).join('\n')}

📅 FOLLOW-UP CARE
Time Frame: ${report.recommendations.followUp.timeFrame}
${report.recommendations.followUp.recommendedSpecialist ? 
  `Recommended Specialist: ${report.recommendations.followUp.recommendedSpecialist}` : ''
}

Seek immediate care if you experience:
${report.recommendations.followUp.urgentSigns.map(sign => `• ${sign}`).join('\n')}

Conditions requiring follow-up:
${report.recommendations.followUp.conditions.map(condition => `• ${condition}`).join('\n')}

═══════════════════════════════════════════════════════════
⚠️  IMPORTANT DISCLAIMER
This assessment is for informational purposes only and should not 
replace professional medical advice, diagnosis, or treatment. Always 
seek the advice of qualified healthcare providers with any questions 
you may have regarding a medical condition.

Generated by AI Health Assistant - ${formatDate(report.assessmentDate)}
═══════════════════════════════════════════════════════════
    `.trim();
  }
}