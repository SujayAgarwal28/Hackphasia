import * as tf from '@tensorflow/tfjs';

interface MLHealthAnalysis {
  symptomPrediction: {
    condition: string;
    confidence: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  }[];
  refugeeSpecificRisks: {
    malnutrition: number;
    ptsd: number;
    infectiousDiseases: number;
    chronicDisease: number;
  };
  culturalFactors: {
    communicationStyle: string;
    familyInvolvement: boolean;
    religiousConsiderations: string[];
  };
  recommendations: string[];
}

interface RefugeeHealthProfile {
  demographics: {
    age?: number;
    gender?: string;
    countryOfOrigin?: string;
    timeInDisplacement?: number;
    familySize?: number;
  };
  symptoms: Array<{
    name: string;
    severity: number;
    duration: string;
    bodyArea?: string;
  }>;
  vitalSigns: {
    temperature?: number;
    bloodPressure?: { systolic: number; diastolic: number };
    heartRate?: number;
    weight?: number;
    height?: number;
  };
  psychosocialFactors: {
    traumaHistory?: boolean;
    separationFromFamily?: boolean;
    languageBarriers?: boolean;
    accessToResources?: 'none' | 'limited' | 'adequate';
  };
  culturalBackground: {
    primaryLanguage: string;
    religiousBackground?: string;
    healthBeliefs?: string[];
  };
}

class MLRefugeeHealthService {
  private symptomPredictionModel: tf.LayersModel | null = null;
  private nutritionAssessmentModel: tf.LayersModel | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize TensorFlow.js
      await tf.ready();
      
      // Create custom ML models for refugee health
      this.symptomPredictionModel = await this.createSymptomPredictionModel();
      this.nutritionAssessmentModel = await this.createNutritionModel();
      
      this.initialized = true;
      console.log('🤖 ML Refugee Health Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize ML models:', error);
      // Continue without ML features
    }
  }

  private async createSymptomPredictionModel(): Promise<tf.LayersModel> {
    // Create a neural network for symptom analysis
    const model = tf.sequential({
      layers: [
        // Input layer: [age, gender, symptoms, vital signs, cultural factors]
        tf.layers.dense({ inputShape: [20], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        // Output layer: [condition probabilities]
        tf.layers.dense({ units: 10, activation: 'softmax' })
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    // Train with synthetic refugee health data
    await this.trainSymptomModel(model);
    
    return model;
  }

  private async createNutritionModel(): Promise<tf.LayersModel> {
    // Model for malnutrition risk assessment
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [15], units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }) // Malnutrition probability
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  private async trainSymptomModel(model: tf.LayersModel): Promise<void> {
    // Synthetic training data based on refugee health patterns
    const trainingData = this.generateRefugeeHealthTrainingData();
    
    const xs = tf.tensor2d(trainingData.inputs);
    const ys = tf.tensor2d(trainingData.outputs);

    await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0
    });

    xs.dispose();
    ys.dispose();
  }

  private generateRefugeeHealthTrainingData() {
    const inputs: number[][] = [];
    const outputs: number[][] = [];

    // Generate synthetic data for common refugee health scenarios
    for (let i = 0; i < 1000; i++) {
      const input = this.generateSyntheticInput();
      const output = this.generateSyntheticOutput(input);
      inputs.push(input);
      outputs.push(output);
    }

    return { inputs, outputs };
  }

  private generateSyntheticInput(): number[] {
    return [
      Math.random() * 80, // age
      Math.random() > 0.5 ? 1 : 0, // gender (0=female, 1=male)
      Math.random() * 5, // fever severity
      Math.random() * 5, // pain severity
      Math.random() * 5, // respiratory symptoms
      Math.random() * 5, // GI symptoms
      Math.random() * 12, // displacement duration (months)
      Math.random() > 0.7 ? 1 : 0, // trauma history
      Math.random() > 0.8 ? 1 : 0, // family separation
      Math.random() * 40 + 95, // temperature
      Math.random() * 50 + 60, // heart rate
      Math.random() * 60 + 90, // systolic BP
      Math.random() > 0.6 ? 1 : 0, // access to healthcare
      Math.random() > 0.5 ? 1 : 0, // language barriers
      Math.random() > 0.3 ? 1 : 0, // cultural factors
      Math.random() * 100, // weight
      Math.random() * 50 + 150, // height
      Math.random() > 0.4 ? 1 : 0, // chronic conditions
      Math.random() > 0.7 ? 1 : 0, // vaccination status
      Math.random() * 3 // resource access level
    ];
  }

  private generateSyntheticOutput(input: number[]): number[] {
    // Map inputs to health conditions (simplified)
    const conditions = new Array(10).fill(0);
    
    // Respiratory infection
    if (input[4] > 3 && input[9] > 38) conditions[0] = 0.8;
    // GI infection
    if (input[5] > 3) conditions[1] = 0.7;
    // Malnutrition
    if (input[15] < 45 && input[6] > 6) conditions[2] = 0.6;
    // PTSD/Mental health
    if (input[7] === 1 && input[8] === 1) conditions[3] = 0.9;
    // Infectious diseases
    if (input[6] > 3 && input[12] === 0) conditions[4] = 0.5;
    
    return conditions;
  }

  async analyzeRefugeeHealth(profile: RefugeeHealthProfile): Promise<MLHealthAnalysis> {
    if (!this.initialized) {
      await this.initialize();
    }

    // Extract features for ML models
    const features = this.extractFeatures(profile);
    
    // Run ML predictions
    const symptomPredictions = await this.predictConditions(features);
    const refugeeRisks = await this.assessRefugeeSpecificRisks(profile);
    const culturalFactors = this.analyzeCulturalFactors(profile);
    
    return {
      symptomPrediction: symptomPredictions,
      refugeeSpecificRisks: refugeeRisks,
      culturalFactors: culturalFactors,
      recommendations: this.generateMLRecommendations(symptomPredictions, refugeeRisks, profile)
    };
  }

  private extractFeatures(profile: RefugeeHealthProfile): number[] {
    const features = [
      profile.demographics.age || 30,
      profile.demographics.gender === 'male' ? 1 : 0,
      this.getSymptomSeverity(profile.symptoms, 'fever'),
      this.getSymptomSeverity(profile.symptoms, 'pain'),
      this.getSymptomSeverity(profile.symptoms, 'respiratory'),
      this.getSymptomSeverity(profile.symptoms, 'gastrointestinal'),
      profile.demographics.timeInDisplacement || 6,
      profile.psychosocialFactors.traumaHistory ? 1 : 0,
      profile.psychosocialFactors.separationFromFamily ? 1 : 0,
      profile.vitalSigns.temperature || 37,
      profile.vitalSigns.heartRate || 70,
      profile.vitalSigns.bloodPressure?.systolic || 120,
      this.getAccessLevel(profile.psychosocialFactors.accessToResources),
      profile.psychosocialFactors.languageBarriers ? 1 : 0,
      this.getCulturalComplexity(profile.culturalBackground),
      profile.vitalSigns.weight || 70,
      profile.vitalSigns.height || 170,
      profile.demographics.familySize || 3,
      this.hasChronicSymptoms(profile.symptoms) ? 1 : 0,
      Math.random() * 3 // Placeholder for vaccination status
    ];

    return features;
  }

  private getSymptomSeverity(symptoms: any[], category: string): number {
    const relevantSymptoms = symptoms.filter(s => 
      s.name.toLowerCase().includes(category) || 
      this.categorizeSymptom(s.name) === category
    );
    return relevantSymptoms.length > 0 ? Math.max(...relevantSymptoms.map(s => s.severity)) : 0;
  }

  private categorizeSymptom(symptomName: string): string {
    const name = symptomName.toLowerCase();
    if (name.includes('fever') || name.includes('temperature')) return 'fever';
    if (name.includes('pain') || name.includes('ache')) return 'pain';
    if (name.includes('cough') || name.includes('breath') || name.includes('chest')) return 'respiratory';
    if (name.includes('nausea') || name.includes('vomit') || name.includes('diarrhea') || name.includes('stomach')) return 'gastrointestinal';
    return 'other';
  }

  private getAccessLevel(access?: string): number {
    switch (access) {
      case 'none': return 0;
      case 'limited': return 1;
      case 'adequate': return 2;
      default: return 1;
    }
  }

  private getCulturalComplexity(cultural: any): number {
    let complexity = 0;
    if (cultural.religiousBackground) complexity += 1;
    if (cultural.healthBeliefs && cultural.healthBeliefs.length > 0) complexity += 1;
    if (cultural.primaryLanguage !== 'en') complexity += 1;
    return complexity;
  }

  private hasChronicSymptoms(symptoms: any[]): boolean {
    return symptoms.some(s => 
      s.duration && (s.duration.includes('month') || s.duration.includes('year'))
    );
  }

  private async predictConditions(features: number[]): Promise<Array<{condition: string; confidence: number; riskLevel: 'low' | 'medium' | 'high' | 'critical'}>> {
    if (!this.symptomPredictionModel) {
      return this.getFallbackPredictions(features);
    }

    try {
      const prediction = this.symptomPredictionModel.predict(tf.tensor2d([features])) as tf.Tensor;
      const probabilities = await prediction.data();
      prediction.dispose();

      const conditions = [
        'Respiratory Infection',
        'Gastrointestinal Infection', 
        'Malnutrition',
        'PTSD/Mental Health Crisis',
        'Infectious Disease',
        'Chronic Disease Exacerbation',
        'Trauma-Related Injury',
        'Vaccination-Preventable Disease',
        'Stress-Related Disorder',
        'General Ill Health'
      ];

      return conditions.map((condition, i) => ({
        condition,
        confidence: probabilities[i],
        riskLevel: this.getRiskLevel(probabilities[i])
      })).sort((a, b) => b.confidence - a.confidence).slice(0, 5);
      
    } catch (error) {
      console.error('ML prediction error:', error);
      return this.getFallbackPredictions(features);
    }
  }

  private getFallbackPredictions(features: number[]): Array<{condition: string; confidence: number; riskLevel: 'low' | 'medium' | 'high' | 'critical'}> {
    // Rule-based fallback when ML fails
    const predictions = [];
    
    if (features[2] > 3) predictions.push({ condition: 'Fever/Infection', confidence: 0.8, riskLevel: 'medium' as const });
    if (features[3] > 4) predictions.push({ condition: 'Severe Pain', confidence: 0.9, riskLevel: 'high' as const });
    if (features[7] === 1) predictions.push({ condition: 'Trauma-Related Stress', confidence: 0.7, riskLevel: 'medium' as const });
    if (features[6] > 12) predictions.push({ condition: 'Chronic Displacement Effects', confidence: 0.6, riskLevel: 'medium' as const });
    
    return predictions.length > 0 ? predictions : [
      { condition: 'General Health Assessment Needed', confidence: 0.5, riskLevel: 'low' as const }
    ];
  }

  private getRiskLevel(confidence: number): 'low' | 'medium' | 'high' | 'critical' {
    if (confidence > 0.8) return 'critical';
    if (confidence > 0.6) return 'high';
    if (confidence > 0.4) return 'medium';
    return 'low';
  }

  private async assessRefugeeSpecificRisks(profile: RefugeeHealthProfile) {
    // Calculate refugee-specific health risks
    const malnutrition = this.calculateMalnutritionRisk(profile);
    const ptsd = this.calculatePTSDRisk(profile);
    const infectiousDiseases = this.calculateInfectiousDiseaseRisk(profile);
    const chronicDisease = this.calculateChronicDiseaseRisk(profile);

    return {
      malnutrition,
      ptsd,
      infectiousDiseases,
      chronicDisease
    };
  }

  private calculateMalnutritionRisk(profile: RefugeeHealthProfile): number {
    let risk = 0.1; // Base risk
    
    // Age factors
    if (profile.demographics.age && profile.demographics.age < 5) risk += 0.3;
    if (profile.demographics.age && profile.demographics.age > 65) risk += 0.2;
    
    // Displacement duration
    if (profile.demographics.timeInDisplacement && profile.demographics.timeInDisplacement > 12) risk += 0.3;
    
    // Access to resources
    if (profile.psychosocialFactors.accessToResources === 'none') risk += 0.4;
    if (profile.psychosocialFactors.accessToResources === 'limited') risk += 0.2;
    
    // Physical indicators
    if (profile.vitalSigns.weight && profile.vitalSigns.height) {
      const bmi = profile.vitalSigns.weight / Math.pow(profile.vitalSigns.height / 100, 2);
      if (bmi < 18.5) risk += 0.4;
    }
    
    return Math.min(risk, 1.0);
  }

  private calculatePTSDRisk(profile: RefugeeHealthProfile): number {
    let risk = 0.2; // Base risk for refugees
    
    if (profile.psychosocialFactors.traumaHistory) risk += 0.4;
    if (profile.psychosocialFactors.separationFromFamily) risk += 0.3;
    if (profile.demographics.timeInDisplacement && profile.demographics.timeInDisplacement > 24) risk += 0.2;
    if (profile.psychosocialFactors.languageBarriers) risk += 0.1;
    
    return Math.min(risk, 1.0);
  }

  private calculateInfectiousDiseaseRisk(profile: RefugeeHealthProfile): number {
    let risk = 0.15; // Base risk
    
    // Crowded conditions risk
    if (profile.demographics.familySize && profile.demographics.familySize > 5) risk += 0.2;
    if (profile.psychosocialFactors.accessToResources === 'none') risk += 0.3;
    
    // Recent displacement
    if (profile.demographics.timeInDisplacement && profile.demographics.timeInDisplacement < 6) risk += 0.2;
    
    // Symptoms indicating infection
    const hasInfectionSymptoms = profile.symptoms.some(s => 
      s.name.toLowerCase().includes('fever') || 
      s.name.toLowerCase().includes('cough') ||
      s.name.toLowerCase().includes('diarrhea')
    );
    if (hasInfectionSymptoms) risk += 0.3;
    
    return Math.min(risk, 1.0);
  }

  private calculateChronicDiseaseRisk(profile: RefugeeHealthProfile): number {
    let risk = 0.1;
    
    if (profile.demographics.age && profile.demographics.age > 50) risk += 0.3;
    if (profile.demographics.timeInDisplacement && profile.demographics.timeInDisplacement > 18) risk += 0.2;
    if (profile.psychosocialFactors.accessToResources !== 'adequate') risk += 0.2;
    
    return Math.min(risk, 1.0);
  }

  private analyzeCulturalFactors(profile: RefugeeHealthProfile) {
    const culturalData = {
      'ar': { style: 'high-context', family: true, religious: ['Islamic practices', 'Halal requirements'] },
      'fa': { style: 'indirect', family: true, religious: ['Islamic practices', 'Prayer times'] },
      'so': { style: 'high-context', family: true, religious: ['Islamic practices', 'Community involvement'] },
      'uk': { style: 'direct', family: false, religious: ['Orthodox Christianity', 'Flexible practices'] }
    };

    const lang = profile.culturalBackground.primaryLanguage;
    const cultural = culturalData[lang as keyof typeof culturalData] || culturalData['ar'];
    
    return {
      communicationStyle: cultural.style,
      familyInvolvement: cultural.family,
      religiousConsiderations: cultural.religious
    };
  }

  private generateMLRecommendations(
    predictions: any[], 
    risks: any, 
    profile: RefugeeHealthProfile
  ): string[] {
    const recommendations = [];
    
    // High-confidence predictions
    const highConfPredictions = predictions.filter(p => p.confidence > 0.6);
    for (const pred of highConfPredictions) {
      recommendations.push(`High likelihood of ${pred.condition} - immediate medical evaluation recommended`);
    }
    
    // Refugee-specific risks
    if (risks.malnutrition > 0.6) {
      recommendations.push('High malnutrition risk - nutritional assessment and supplementation needed');
    }
    if (risks.ptsd > 0.7) {
      recommendations.push('Significant trauma indicators - mental health support strongly recommended');
    }
    if (risks.infectiousDiseases > 0.6) {
      recommendations.push('Elevated infection risk - screening for communicable diseases advised');
    }
    
    // Cultural recommendations
    if (profile.psychosocialFactors.languageBarriers) {
      recommendations.push('Language interpreter services needed for accurate assessment');
    }
    if (profile.culturalBackground.religiousBackground) {
      recommendations.push('Consider religious and cultural preferences in treatment planning');
    }
    
    // Age-specific
    if (profile.demographics.age && profile.demographics.age < 5) {
      recommendations.push('Pediatric specialist consultation recommended for young refugee child');
    }
    if (profile.demographics.age && profile.demographics.age > 65) {
      recommendations.push('Geriatric assessment needed - elderly refugees have complex health needs');
    }
    
    return recommendations.length > 0 ? recommendations : [
      'Continue monitoring symptoms and seek medical care if condition worsens',
      'Ensure access to clean water, adequate nutrition, and safe shelter'
    ];
  }
}

export default MLRefugeeHealthService;
export type { MLHealthAnalysis, RefugeeHealthProfile };