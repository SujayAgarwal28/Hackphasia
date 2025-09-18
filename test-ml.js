// Test script to understand ML model behavior
import MLRefugeeHealthService from './src/ai/MLRefugeeHealthService.js';

const testMLService = async () => {
  console.log('🧪 Testing ML Refugee Health Service...\n');
  
  const mlService = new MLRefugeeHealthService();
  await mlService.initialize();
  
  // Test Case 1: Syrian refugee with respiratory symptoms
  const syrianCase = {
    demographics: {
      age: 35,
      gender: 'male',
      countryOfOrigin: 'Syria',
      timeInDisplacement: 18, // 1.5 years
      familySize: 5
    },
    symptoms: [
      { name: 'cough', severity: 4, duration: '1 week', bodyArea: 'chest' },
      { name: 'fever', severity: 3, duration: '3 days', bodyArea: 'general' }
    ],
    vitalSigns: {
      temperature: 38.7,
      heartRate: 95,
      bloodPressure: { systolic: 130, diastolic: 85 }
    },
    psychosocialFactors: {
      traumaHistory: true,
      separationFromFamily: false,
      languageBarriers: true,
      accessToResources: 'limited'
    },
    culturalBackground: {
      primaryLanguage: 'ar',
      religiousBackground: 'Islamic'
    }
  };
  
  console.log('📊 Case 1: Syrian refugee with respiratory symptoms');
  const result1 = await mlService.analyzeRefugeeHealth(syrianCase);
  console.log('ML Predictions:', result1.symptomPrediction.slice(0,3));
  console.log('Refugee Risks:', result1.refugeeSpecificRisks);
  console.log('Cultural Factors:', result1.culturalFactors);
  console.log('\n');
  
  // Test Case 2: Ukrainian refugee with trauma symptoms
  const ukrainianCase = {
    demographics: {
      age: 28,
      gender: 'female',
      countryOfOrigin: 'Ukraine',
      timeInDisplacement: 8,
      familySize: 2
    },
    symptoms: [
      { name: 'headache', severity: 5, duration: '2 weeks', bodyArea: 'head' },
      { name: 'insomnia', severity: 4, duration: '1 month', bodyArea: 'general' }
    ],
    vitalSigns: {
      temperature: 36.8,
      heartRate: 105,
      bloodPressure: { systolic: 145, diastolic: 90 }
    },
    psychosocialFactors: {
      traumaHistory: true,
      separationFromFamily: true,
      languageBarriers: false,
      accessToResources: 'adequate'
    },
    culturalBackground: {
      primaryLanguage: 'uk'
    }
  };
  
  console.log('📊 Case 2: Ukrainian refugee with trauma symptoms');
  const result2 = await mlService.analyzeRefugeeHealth(ukrainianCase);
  console.log('ML Predictions:', result2.symptomPrediction.slice(0,3));
  console.log('Refugee Risks:', result2.refugeeSpecificRisks);
  console.log('Cultural Factors:', result2.culturalFactors);
  console.log('\n');
  
  // Test Case 3: Afghan child with malnutrition signs
  const afghanCase = {
    demographics: {
      age: 7,
      gender: 'female',
      countryOfOrigin: 'Afghanistan',
      timeInDisplacement: 24,
      familySize: 8
    },
    symptoms: [
      { name: 'fatigue', severity: 4, duration: '2 months', bodyArea: 'general' },
      { name: 'poor appetite', severity: 5, duration: '1 month', bodyArea: 'general' }
    ],
    vitalSigns: {
      temperature: 36.5,
      heartRate: 110,
      weight: 15, // Underweight for age
      height: 110
    },
    psychosocialFactors: {
      traumaHistory: true,
      separationFromFamily: false,
      languageBarriers: true,
      accessToResources: 'none'
    },
    culturalBackground: {
      primaryLanguage: 'fa',
      religiousBackground: 'Islamic'
    }
  };
  
  console.log('📊 Case 3: Afghan child with malnutrition signs');
  const result3 = await mlService.analyzeRefugeeHealth(afghanCase);
  console.log('ML Predictions:', result3.symptomPrediction.slice(0,3));
  console.log('Refugee Risks:', result3.refugeeSpecificRisks);
  console.log('Recommendations:', result3.recommendations.slice(0,3));
  console.log('\n');
  
  console.log('✅ ML Model testing complete!');
};

testMLService().catch(console.error);