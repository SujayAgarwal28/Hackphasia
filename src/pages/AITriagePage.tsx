import { useState, useEffect } from 'react';
import MLRefugeeHealthService from '../ai/EnhancedMLRefugeeHealthService';

interface MLHealthAnalysis {
  predictions: number[];
  ensembleAgreement: number;
  confidence: number;
  modelAccuracy: number;
}

interface RefugeeHealthProfile {
  age: number;
  gender: number;
  displacement_duration: number;
  country_risk_factor: number;
  cultural_background: number;
  symptoms_primary: number;
  symptoms_secondary: number;
  vital_signs: number[];
  trauma_history: number;
  family_separation: number;
  access_healthcare: number;
  vaccination_status: number;
  nutrition_status: number;
  mental_health_indicators: number;
  chronic_conditions: number;
  infectious_disease_exposure: number;
  language_barriers: number;
  resource_access: number;
  social_support: number;
  living_conditions: number;
  previous_healthcare: number;
}
import DrawYourPain, { type BodyZone } from '../components/DrawYourPain';

interface PatientInfo {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  allergies: string[];
  medications: string[];
  medicalHistory: string[];
  // Refugee-specific fields
  countryOfOrigin?: string;
  timeInDisplacement?: number;
  familySize?: number;
  traumaHistory?: boolean;
  separationFromFamily?: boolean;
  languageBarriers?: boolean;
  accessToResources?: 'none' | 'limited' | 'adequate';
  primaryLanguage?: string;
  religiousBackground?: string;
  vaccinationStatus?: 'complete' | 'partial' | 'none' | 'unknown';
  currentLivingSituation?: 'camp' | 'shelter' | 'host_family' | 'independent' | 'street';
}

interface Symptom {
  name: string;
  severity: 1 | 2 | 3 | 4 | 5;
  duration: string;
  onset: 'sudden' | 'gradual';
  description: string;
}

interface VitalSigns {
  temperature?: number;
  bloodPressure?: { systolic: number; diastolic: number };
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  painLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

interface Assessment {
  id: string;
  timestamp: Date;
  patientInfo: PatientInfo;
  chiefComplaint: string;
  symptoms: Symptom[];
  vitalSigns: VitalSigns;
  triageLevel: 1 | 2 | 3 | 4 | 5;
  recommendations: string[];
  differentialDiagnosis: { condition: string; probability: number; reasoning: string }[];
  redFlags: string[];
  disposition: 'emergency' | 'urgent_care' | 'primary_care' | 'self_care' | 'monitor';
}

const TRIAGE_LEVELS = {
  1: { name: 'Resuscitation', color: 'bg-red-600', description: 'Immediate life-threatening', time: 'Immediate' },
  2: { name: 'Emergency', color: 'bg-orange-500', description: 'Imminently life-threatening', time: '≤ 10 minutes' },
  3: { name: 'Urgent', color: 'bg-yellow-500', description: 'Potentially life-threatening', time: '≤ 30 minutes' },
  4: { name: 'Semi-urgent', color: 'bg-green-500', description: 'Potentially serious', time: '≤ 60 minutes' },
  5: { name: 'Non-urgent', color: 'bg-blue-500', description: 'Less urgent', time: '≤ 120 minutes' }
};

const AITriagePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'intake' | 'symptoms' | 'vitals' | 'assessment' | 'results'>('intake');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    allergies: [],
    medications: [],
    medicalHistory: []
  });
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({});
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mlHealthService] = useState(new MLRefugeeHealthService());
  const [mlAnalysis, setMlAnalysis] = useState<MLHealthAnalysis | null>(null);
  const [bodyZones, setBodyZones] = useState<BodyZone[]>([]);

  useEffect(() => {
    // Initialize ML service
    mlHealthService.initialize().catch(console.error);
  }, [mlHealthService]);

  const steps = [
    { id: 'intake', name: 'Patient Intake', icon: '👤' },
    { id: 'symptoms', name: 'Symptom Assessment', icon: '🩺' },
    { id: 'vitals', name: 'Vital Signs', icon: '📊' },
    { id: 'assessment', name: 'AI Analysis', icon: '🧠' },
    { id: 'results', name: 'Results & Plan', icon: '📋' }
  ];

  const addSymptom = () => {
    setSymptoms([...symptoms, {
      name: '',
      severity: 3,
      duration: '',
      onset: 'gradual',
      description: ''
    }]);
  };

  const updateSymptom = (index: number, field: keyof Symptom, value: any) => {
    const updated = [...symptoms];
    updated[index] = { ...updated[index], [field]: value };
    setSymptoms(updated);
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleBodyZoneSelect = (zone: BodyZone) => {
    if (zone.painLevel === 0) {
      // Remove zone
      setBodyZones(prev => prev.filter(z => z.id !== zone.id));
    } else {
      // Add or update zone
      setBodyZones(prev => {
        const existing = prev.findIndex(z => z.id === zone.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = zone;
          return updated;
        } else {
          return [...prev, zone];
        }
      });
    }
  };

  const conductAIAssessment = async () => {
    setIsProcessing(true);
    setCurrentStep('assessment');

    try {
      // Run ML analysis for refugee-specific health assessment
      const refugeeProfile: RefugeeHealthProfile = {
        demographics: {
          age: patientInfo.age,
          gender: patientInfo.gender,
          countryOfOrigin: patientInfo.countryOfOrigin,
          timeInDisplacement: patientInfo.timeInDisplacement,
          familySize: patientInfo.familySize
        },
        symptoms: symptoms.map(s => ({
          name: s.name,
          severity: s.severity,
          duration: s.duration,
          bodyArea: s.description
        })),
        vitalSigns: vitalSigns,
        psychosocialFactors: {
          traumaHistory: patientInfo.traumaHistory,
          separationFromFamily: patientInfo.separationFromFamily,
          languageBarriers: patientInfo.languageBarriers,
          accessToResources: patientInfo.accessToResources
        },
        culturalBackground: {
          primaryLanguage: patientInfo.primaryLanguage || 'en',
          religiousBackground: patientInfo.religiousBackground
        }
      };

      // Create feature vector for enhanced ML model
      const features = [
        parseFloat(patientInfo.age?.toString() || '25'),
        patientInfo.gender === 'male' ? 1 : 0,
        parseFloat(patientInfo.displacementDuration?.toString() || '6'),
        0.5, // country risk factor
        1, // cultural_background
        parseFloat(chiefComplaint.painLevel?.toString() || '0'),
        symptoms.primarySymptoms?.length || 0,
        parseFloat(vitalSigns.temperature?.toString() || '37'),
        parseFloat(vitalSigns.heartRate?.toString() || '80'),
        parseFloat(vitalSigns.systolicBP?.toString() || '120'),
        patientInfo.traumaHistory ? 1 : 0,
        patientInfo.separationFromFamily ? 1 : 0,
        1, // access to healthcare
        1, // vaccination status
        0, // nutrition score
        0, // mental health score
        0, // chronic conditions
        0, // infectious disease exposure  
        patientInfo.primaryLanguage !== 'en' ? 1 : 0,
        0, // resource access score
        1, // social support
        0, // living conditions score
        0, 0, 0 // additional features
      ];

      // Get ML-powered analysis with enhanced model
      const mlResult = await mlHealthService.predictWithEnsemble(features);
      setMlAnalysis(mlResult);

      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAssessment: Assessment = {
        id: `assessment_${Date.now()}`,
        timestamp: new Date(),
        patientInfo,
        chiefComplaint,
        symptoms,
        vitalSigns,
        triageLevel: calculateTriageLevel(),
        recommendations: generateRecommendations(),
        differentialDiagnosis: generateDifferentialDx(),
        redFlags: identifyRedFlags(),
        disposition: determineDisposition()
      };

      setAssessment(mockAssessment);
      setCurrentStep('results');
    } catch (error) {
      console.error('Assessment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTriageLevel = (): 1 | 2 | 3 | 4 | 5 => {
    const symptomNames = symptoms.map(s => s.name.toLowerCase());
    const complaintLower = chiefComplaint.toLowerCase();
    let score = 0;
    
    // Critical vital signs (Level 1-2)
    if (vitalSigns.temperature && vitalSigns.temperature > 40) score += 8; // Very high fever
    if (vitalSigns.bloodPressure && vitalSigns.bloodPressure.systolic > 200) score += 8; // Hypertensive crisis
    if (vitalSigns.heartRate && (vitalSigns.heartRate > 130 || vitalSigns.heartRate < 50)) score += 7; // Severe tachy/bradycardia
    if (vitalSigns.oxygenSaturation && vitalSigns.oxygenSaturation < 95) score += 8; // Severe hypoxia
    
    // Emergency symptoms (Level 2-3)
    if (symptomNames.some(s => s.includes('chest pain')) && vitalSigns.painLevel && vitalSigns.painLevel >= 7) score += 6;
    if (symptomNames.some(s => s.includes('shortness of breath') || s.includes('breathing'))) score += 5;
    if (symptomNames.some(s => s.includes('confusion') || s.includes('altered'))) score += 6;
    if (complaintLower.includes('severe') || symptomNames.some(s => s.includes('severe'))) score += 4;
    
    // Moderate vital signs (Level 3-4)
    if (vitalSigns.temperature && vitalSigns.temperature > 39) score += 4; // High fever
    if (vitalSigns.bloodPressure && vitalSigns.bloodPressure.systolic > 180) score += 3; // Moderate hypertension
    if (vitalSigns.heartRate && (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 60)) score += 3;
    if (vitalSigns.painLevel && vitalSigns.painLevel >= 8) score += 4; // Severe pain
    
    // Symptom severity scoring
    symptoms.forEach(symptom => {
      if (symptom.severity >= 5) score += 3;
      else if (symptom.severity >= 4) score += 2;
      else if (symptom.severity >= 3) score += 1;
      
      // Acute onset increases urgency
      if (symptom.onset === 'sudden') score += 1;
    });
    
    // Age-based risk adjustment
    if (patientInfo.age && patientInfo.age > 75) score += 2; // Elderly
    if (patientInfo.age && patientInfo.age < 2) score += 3; // Very young
    
    // Multiple symptoms increase complexity
    if (symptoms.length >= 3) score += 1;
    if (symptoms.length >= 5) score += 2;
    
    // Convert score to triage level
    if (score >= 8) return 1; // Resuscitation
    if (score >= 6) return 2; // Emergency
    if (score >= 4) return 3; // Urgent
    if (score >= 2) return 4; // Semi-urgent
    return 5; // Non-urgent
  };

  const analyzeSymptoms = () => {
    const symptomNames = symptoms.map(s => s.name.toLowerCase());
    const complaintLower = chiefComplaint.toLowerCase();
    const allSymptoms = [...symptomNames, complaintLower];
    
    // Common symptom patterns and their associated conditions
    const patterns = {
      // Respiratory symptoms
      respiratory: {
        keywords: ['cough', 'shortness of breath', 'chest pain', 'wheezing', 'sore throat', 'runny nose', 'congestion'],
        conditions: [
          { name: 'Upper Respiratory Tract Infection', probability: 0.7, reasoning: 'Common viral infection' },
          { name: 'Bronchitis', probability: 0.2, reasoning: 'Lower respiratory involvement' },
          { name: 'Pneumonia', probability: 0.1, reasoning: 'Consider if fever and severe symptoms' }
        ]
      },
      // Musculoskeletal symptoms
      musculoskeletal: {
        keywords: ['leg pain', 'back pain', 'joint pain', 'muscle pain', 'stiffness', 'swelling', 'bruising'],
        conditions: [
          { name: 'Musculoskeletal Strain', probability: 0.6, reasoning: 'Most common cause of limb pain' },
          { name: 'Arthritis', probability: 0.2, reasoning: 'Consider if joint involvement' },
          { name: 'Trauma/Injury', probability: 0.2, reasoning: 'Assess for recent injury' }
        ]
      },
      // Gastrointestinal symptoms
      gastrointestinal: {
        keywords: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'stomach pain', 'heartburn'],
        conditions: [
          { name: 'Gastroenteritis', probability: 0.6, reasoning: 'Common GI infection' },
          { name: 'Food Poisoning', probability: 0.3, reasoning: 'Consider recent food intake' },
          { name: 'Peptic Ulcer Disease', probability: 0.1, reasoning: 'If chronic pain pattern' }
        ]
      },
      // Neurological symptoms
      neurological: {
        keywords: ['headache', 'dizziness', 'confusion', 'weakness', 'numbness', 'tingling'],
        conditions: [
          { name: 'Tension Headache', probability: 0.5, reasoning: 'Most common headache type' },
          { name: 'Migraine', probability: 0.3, reasoning: 'Consider if severe/pulsating' },
          { name: 'Viral Syndrome', probability: 0.2, reasoning: 'Part of systemic illness' }
        ]
      },
      // Cardiovascular symptoms
      cardiovascular: {
        keywords: ['chest pain', 'heart palpitations', 'shortness of breath', 'fainting', 'dizziness'],
        conditions: [
          { name: 'Anxiety/Panic Attack', probability: 0.4, reasoning: 'Common in young patients' },
          { name: 'Cardiac Arrhythmia', probability: 0.3, reasoning: 'Consider if palpitations present' },
          { name: 'Myocardial Infarction', probability: 0.3, reasoning: 'Emergency consideration' }
        ]
      }
    };

    // Find matching pattern
    let bestMatch = null;
    let maxMatches = 0;

    for (const [category, pattern] of Object.entries(patterns)) {
      const matches = pattern.keywords.filter(keyword => 
        allSymptoms.some(symptom => symptom.includes(keyword))
      ).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = { category, pattern };
      }
    }

    return bestMatch?.pattern.conditions.map(c => ({
      condition: c.name,
      probability: c.probability,
      reasoning: c.reasoning
    })) || [
      { condition: 'Undifferentiated Symptom Complex', probability: 0.8, reasoning: 'Requires further evaluation' },
      { condition: 'Viral Syndrome', probability: 0.2, reasoning: 'Consider common viral illness' }
    ];
  };

  const generateRecommendations = (): string[] => {
    const recommendations = [];
    const symptomNames = symptoms.map(s => s.name.toLowerCase());
    
    // Fever management
    if (vitalSigns.temperature && vitalSigns.temperature > 38.5) {
      recommendations.push('Monitor temperature every 4 hours, use acetaminophen or ibuprofen for fever reduction');
    }
    
    // Pain management
    if (vitalSigns.painLevel && vitalSigns.painLevel >= 7) {
      recommendations.push('Severe pain requires immediate attention - consider prescription analgesics');
    } else if (vitalSigns.painLevel && vitalSigns.painLevel >= 4) {
      recommendations.push('Moderate pain - over-the-counter pain relievers may help');
    }
    
    // Respiratory symptoms
    if (symptomNames.some(s => s.includes('cough') || s.includes('throat'))) {
      recommendations.push('Stay hydrated, consider throat lozenges, humidify air');
    }
    
    // Musculoskeletal symptoms
    if (symptomNames.some(s => s.includes('pain') && (s.includes('leg') || s.includes('back') || s.includes('joint')))) {
      recommendations.push('Apply ice for acute injury, heat for chronic pain, gentle movement as tolerated');
      recommendations.push('Rest the affected area, elevate if swollen');
    }
    
    // GI symptoms
    if (symptomNames.some(s => s.includes('nausea') || s.includes('vomiting') || s.includes('diarrhea'))) {
      recommendations.push('Maintain hydration with small frequent sips, BRAT diet if tolerated');
    }
    
    // High severity symptoms
    if (symptoms.some(s => s.severity >= 4)) {
      recommendations.push('High severity symptoms require medical evaluation within 24 hours');
    }
    
    // General recommendations
    recommendations.push('Monitor symptoms closely for any worsening');
    recommendations.push('Return for evaluation if symptoms persist beyond expected timeframe');
    recommendations.push('Seek immediate care if new concerning symptoms develop');
    
    return recommendations;
  };

  const generateDifferentialDx = () => {
    return analyzeSymptoms();
  };

  const identifyRedFlags = (): string[] => {
    const redFlags = [];
    const symptomNames = symptoms.map(s => s.name.toLowerCase());
    const complaintLower = chiefComplaint.toLowerCase();
    
    // Vital sign red flags
    if (vitalSigns.temperature && vitalSigns.temperature > 39.5) {
      redFlags.push('High fever (>39.5°C) - risk of serious bacterial infection');
    }
    if (vitalSigns.bloodPressure && vitalSigns.bloodPressure.systolic > 200) {
      redFlags.push('Severe hypertension - hypertensive crisis risk');
    }
    if (vitalSigns.heartRate && vitalSigns.heartRate > 130) {
      redFlags.push('Severe tachycardia - potential cardiac emergency');
    }
    if (vitalSigns.heartRate && vitalSigns.heartRate < 50) {
      redFlags.push('Severe bradycardia - potential cardiac emergency');
    }
    if (vitalSigns.oxygenSaturation && vitalSigns.oxygenSaturation < 95) {
      redFlags.push('Low oxygen saturation - respiratory emergency');
    }
    
    // Symptom-based red flags
    if (symptomNames.some(s => s.includes('chest pain')) && vitalSigns.painLevel && vitalSigns.painLevel >= 7) {
      redFlags.push('Severe chest pain - rule out myocardial infarction');
    }
    if (symptomNames.some(s => s.includes('shortness of breath') || s.includes('breathing'))) {
      redFlags.push('Respiratory distress - requires immediate evaluation');
    }
    if (symptomNames.some(s => s.includes('confusion') || s.includes('altered'))) {
      redFlags.push('Altered mental status - neurological emergency');
    }
    if (symptomNames.some(s => s.includes('severe') || complaintLower.includes('severe'))) {
      redFlags.push('Patient reports severe symptoms - high acuity');
    }
    
    // Age-based considerations
    if (patientInfo.age && patientInfo.age > 65) {
      redFlags.push('Elderly patient - higher risk for complications');
    }
    if (patientInfo.age && patientInfo.age < 1) {
      redFlags.push('Infant - requires immediate pediatric evaluation');
    }
    
    return redFlags;
  };

  const determineDisposition = (): Assessment['disposition'] => {
    const triageLevel = calculateTriageLevel();
    if (triageLevel <= 2) return 'emergency';
    if (triageLevel === 3) return 'urgent_care';
    if (triageLevel === 4) return 'primary_care';
    return 'self_care';
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === step.id ? 'bg-blue-600 text-white' :
              steps.findIndex(s => s.id === currentStep) > index ? 'bg-green-500 text-white' :
              'bg-neutral-200 text-neutral-600'
            }`}>
              {steps.findIndex(s => s.id === currentStep) > index ? '✓' : step.icon}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              currentStep === step.id ? 'text-blue-600' : 'text-neutral-600'
            }`}>
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div className={`mx-4 w-8 h-0.5 ${
                steps.findIndex(s => s.id === currentStep) > index ? 'bg-green-500' : 'bg-neutral-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPatientIntake = () => (
    <div className="card max-w-2xl mx-auto">
      <div className="card-header">
        <h3 className="text-xl font-semibold text-neutral-900">Patient Information</h3>
        <p className="text-neutral-600">Basic demographic and medical history</p>
      </div>
      <div className="card-body space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Age</label>
            <input
              type="number"
              value={patientInfo.age || ''}
              onChange={(e) => setPatientInfo({...patientInfo, age: parseInt(e.target.value) || undefined})}
              className="form-input"
              placeholder="Enter age"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Gender</label>
            <select
              value={patientInfo.gender || ''}
              onChange={(e) => setPatientInfo({...patientInfo, gender: e.target.value as any})}
              className="form-select"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Chief Complaint</label>
          <textarea
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            placeholder="Describe the main reason for seeking medical attention..."
            className="form-textarea h-24"
          />
        </div>

        {/* Refugee-Specific Information */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-neutral-900 mb-4">🏠 Displacement & Cultural Information</h4>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Country of Origin</label>
              <input
                type="text"
                value={patientInfo.countryOfOrigin || ''}
                onChange={(e) => setPatientInfo({...patientInfo, countryOfOrigin: e.target.value})}
                placeholder="e.g., Syria, Afghanistan, Ukraine"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Time in Displacement (months)</label>
              <input
                type="number"
                value={patientInfo.timeInDisplacement || ''}
                onChange={(e) => setPatientInfo({...patientInfo, timeInDisplacement: parseInt(e.target.value) || undefined})}
                placeholder="How long since leaving home"
                className="form-input"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Primary Language</label>
              <select
                value={patientInfo.primaryLanguage || ''}
                onChange={(e) => setPatientInfo({...patientInfo, primaryLanguage: e.target.value})}
                className="form-select"
              >
                <option value="">Select language</option>
                <option value="ar">Arabic (العربية)</option>
                <option value="fa">Persian/Farsi (فارسی)</option>
                <option value="so">Somali (Soomaali)</option>
                <option value="uk">Ukrainian (Українська)</option>
                <option value="fr">French (Français)</option>
                <option value="en">English</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Current Living Situation</label>
              <select
                value={patientInfo.currentLivingSituation || ''}
                onChange={(e) => setPatientInfo({...patientInfo, currentLivingSituation: e.target.value as any})}
                className="form-select"
              >
                <option value="">Select situation</option>
                <option value="camp">Refugee Camp</option>
                <option value="shelter">Emergency Shelter</option>
                <option value="host_family">With Host Family</option>
                <option value="independent">Independent Housing</option>
                <option value="street">Homeless/Street</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Family Size</label>
              <input
                type="number"
                value={patientInfo.familySize || ''}
                onChange={(e) => setPatientInfo({...patientInfo, familySize: parseInt(e.target.value) || undefined})}
                placeholder="Number of family members"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Access to Resources</label>
              <select
                value={patientInfo.accessToResources || ''}
                onChange={(e) => setPatientInfo({...patientInfo, accessToResources: e.target.value as any})}
                className="form-select"
              >
                <option value="">Select access level</option>
                <option value="adequate">Adequate</option>
                <option value="limited">Limited</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Vaccination Status</label>
              <select
                value={patientInfo.vaccinationStatus || ''}
                onChange={(e) => setPatientInfo({...patientInfo, vaccinationStatus: e.target.value as any})}
                className="form-select"
              >
                <option value="">Select status</option>
                <option value="complete">Complete</option>
                <option value="partial">Partial</option>
                <option value="none">None</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={patientInfo.traumaHistory || false}
                onChange={(e) => setPatientInfo({...patientInfo, traumaHistory: e.target.checked})}
                className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-neutral-700">History of trauma or violence</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={patientInfo.separationFromFamily || false}
                onChange={(e) => setPatientInfo({...patientInfo, separationFromFamily: e.target.checked})}
                className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-neutral-700">Separated from family members</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={patientInfo.languageBarriers || false}
                onChange={(e) => setPatientInfo({...patientInfo, languageBarriers: e.target.checked})}
                className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-neutral-700">Difficulty communicating in local language</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Known Allergies</label>
          <input
            type="text"
            placeholder="e.g., Penicillin, Nuts, Shellfish"
            className="form-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                setPatientInfo({
                  ...patientInfo,
                  allergies: [...patientInfo.allergies, e.currentTarget.value.trim()]
                });
                e.currentTarget.value = '';
              }
            }}
          />
          {patientInfo.allergies.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {patientInfo.allergies.map((allergy, index) => (
                <span key={index} className="inline-flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                  {allergy}
                  <button
                    onClick={() => setPatientInfo({
                      ...patientInfo,
                      allergies: patientInfo.allergies.filter((_, i) => i !== index)
                    })}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setCurrentStep('symptoms')}
            disabled={!chiefComplaint.trim()}
            className="btn-primary"
          >
            Continue to Symptoms
          </button>
        </div>
      </div>
    </div>
  );

  const renderSymptomAssessment = () => (
    <div className="card max-w-4xl mx-auto">
      <div className="card-header">
        <h3 className="text-xl font-semibold text-neutral-900">Symptom Assessment</h3>
        <p className="text-neutral-600">Detailed symptom evaluation and severity rating</p>
      </div>
      <div className="card-body space-y-6">
        {symptoms.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-500 mb-4">No symptoms added yet</p>
            <button onClick={addSymptom} className="btn-primary">
              Add First Symptom
            </button>
          </div>
        )}

        {symptoms.map((symptom, index) => (
          <div key={index} className="border border-neutral-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-neutral-900">Symptom {index + 1}</h4>
              <button
                onClick={() => removeSymptom(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Symptom Name</label>
                <input
                  type="text"
                  value={symptom.name}
                  onChange={(e) => updateSymptom(index, 'name', e.target.value)}
                  placeholder="e.g., Headache, Fever, Chest pain"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Severity (1-5): {symptom.severity}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={symptom.severity}
                  onChange={(e) => updateSymptom(index, 'severity', parseInt(e.target.value) as any)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={symptom.duration}
                  onChange={(e) => updateSymptom(index, 'duration', e.target.value)}
                  placeholder="e.g., 2 days, 1 week, 3 hours"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Onset</label>
                <select
                  value={symptom.onset}
                  onChange={(e) => updateSymptom(index, 'onset', e.target.value)}
                  className="form-select"
                >
                  <option value="gradual">Gradual</option>
                  <option value="sudden">Sudden</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
              <textarea
                value={symptom.description}
                onChange={(e) => updateSymptom(index, 'description', e.target.value)}
                placeholder="Describe the symptom in detail..."
                className="form-textarea h-20"
              />
            </div>
          </div>
        ))}

        {/* Draw Your Pain Component */}
        <div className="border-t pt-6">
          <DrawYourPain 
            onBodyZoneSelect={handleBodyZoneSelect}
            selectedZones={bodyZones}
          />
        </div>

        <div className="flex justify-between">
          <button onClick={addSymptom} className="btn-secondary">
            Add Another Symptom
          </button>
          <div className="space-x-3">
            <button onClick={() => setCurrentStep('intake')} className="btn-secondary">
              Back
            </button>
            <button
              onClick={() => setCurrentStep('vitals')}
              disabled={symptoms.length === 0 || symptoms.some(s => !s.name.trim())}
              className="btn-primary"
            >
              Continue to Vital Signs
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVitalSigns = () => (
    <div className="card max-w-2xl mx-auto">
      <div className="card-header">
        <h3 className="text-xl font-semibold text-neutral-900">Vital Signs</h3>
        <p className="text-neutral-600">Record current vital signs and pain level</p>
      </div>
      <div className="card-body space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Temperature (°C)</label>
            <input
              type="number"
              step="0.1"
              value={vitalSigns.temperature || ''}
              onChange={(e) => setVitalSigns({...vitalSigns, temperature: parseFloat(e.target.value) || undefined})}
              placeholder="36.5"
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Heart Rate (bpm)</label>
            <input
              type="number"
              value={vitalSigns.heartRate || ''}
              onChange={(e) => setVitalSigns({...vitalSigns, heartRate: parseInt(e.target.value) || undefined})}
              placeholder="70"
              className="form-input"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Blood Pressure</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={vitalSigns.bloodPressure?.systolic || ''}
                onChange={(e) => setVitalSigns({
                  ...vitalSigns,
                  bloodPressure: {
                    systolic: parseInt(e.target.value) || 0,
                    diastolic: vitalSigns.bloodPressure?.diastolic || 0
                  }
                })}
                placeholder="120"
                className="form-input"
              />
              <span className="flex items-center">/</span>
              <input
                type="number"
                value={vitalSigns.bloodPressure?.diastolic || ''}
                onChange={(e) => setVitalSigns({
                  ...vitalSigns,
                  bloodPressure: {
                    systolic: vitalSigns.bloodPressure?.systolic || 0,
                    diastolic: parseInt(e.target.value) || 0
                  }
                })}
                placeholder="80"
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Oxygen Saturation (%)</label>
            <input
              type="number"
              value={vitalSigns.oxygenSaturation || ''}
              onChange={(e) => setVitalSigns({...vitalSigns, oxygenSaturation: parseInt(e.target.value) || undefined})}
              placeholder="98"
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Pain Level (0-10): {vitalSigns.painLevel || 0}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={vitalSigns.painLevel || 0}
            onChange={(e) => setVitalSigns({...vitalSigns, painLevel: parseInt(e.target.value) as any})}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>No Pain</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
        </div>

        <div className="flex justify-between">
          <button onClick={() => setCurrentStep('symptoms')} className="btn-secondary">
            Back
          </button>
          <button onClick={conductAIAssessment} className="btn-primary">
            Start AI Assessment
          </button>
        </div>
      </div>
    </div>
  );

  const renderAssessment = () => (
    <div className="card max-w-2xl mx-auto">
      <div className="card-header">
        <h3 className="text-xl font-semibold text-neutral-900">AI Medical Analysis</h3>
        <p className="text-neutral-600">Processing clinical data with artificial intelligence</p>
      </div>
      <div className="card-body">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
          <h4 className="text-lg font-medium text-neutral-900 mb-2">Analyzing Clinical Data</h4>
          <p className="text-neutral-600 mb-4">
            Our AI is processing symptoms, vital signs, and medical history to provide clinical insights.
          </p>
          <div className="space-y-2 text-sm text-neutral-500">
            <div>✓ Symptom pattern recognition</div>
            <div>✓ Refugee-specific risk assessment</div>
            <div>✓ Cultural adaptation analysis</div>
            <div>✓ ML-powered differential diagnosis</div>
            <div>⏳ Generating trauma-informed recommendations</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!assessment) return null;

    const triageInfo = TRIAGE_LEVELS[assessment.triageLevel];

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Triage Level Header */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${triageInfo.color}`}>
                  {assessment.triageLevel}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">{triageInfo.name}</h2>
                  <p className="text-neutral-600">{triageInfo.description}</p>
                  <p className="text-sm text-neutral-500">Target time: {triageInfo.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500">Assessment completed</p>
                <p className="text-sm font-medium">{assessment.timestamp.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* ML-Powered Analysis */}
          {mlAnalysis && (
            <div className="lg:col-span-2 card border-blue-200">
              <div className="card-header bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-900">🤖 AI-Powered Refugee Health Analysis</h3>
                <p className="text-blue-700 text-sm">Machine learning analysis considering displacement context</p>
              </div>
              <div className="card-body space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-2">Top ML Predictions</h4>
                    {mlAnalysis.symptomPrediction.slice(0, 3).map((pred, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-neutral-50 rounded mb-2">
                        <span className="text-sm">{pred.condition}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            pred.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                            pred.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                            pred.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {pred.riskLevel}
                          </span>
                          <span className="text-sm font-medium">{Math.round(pred.confidence * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-2">Refugee-Specific Risk Assessment</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Malnutrition Risk:</span>
                        <span className={`text-sm font-medium ${mlAnalysis.refugeeSpecificRisks.malnutrition > 0.6 ? 'text-red-600' : 'text-green-600'}`}>
                          {Math.round(mlAnalysis.refugeeSpecificRisks.malnutrition * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">PTSD Risk:</span>
                        <span className={`text-sm font-medium ${mlAnalysis.refugeeSpecificRisks.ptsd > 0.6 ? 'text-red-600' : 'text-green-600'}`}>
                          {Math.round(mlAnalysis.refugeeSpecificRisks.ptsd * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Infectious Disease Risk:</span>
                        <span className={`text-sm font-medium ${mlAnalysis.refugeeSpecificRisks.infectiousDiseases > 0.6 ? 'text-red-600' : 'text-green-600'}`}>
                          {Math.round(mlAnalysis.refugeeSpecificRisks.infectiousDiseases * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Cultural Considerations</h4>
                  <div className="grid md:grid-cols-3 gap-2 text-sm">
                    <div className="bg-neutral-50 p-2 rounded">
                      <strong>Communication:</strong> {mlAnalysis.culturalFactors.communicationStyle}
                    </div>
                    <div className="bg-neutral-50 p-2 rounded">
                      <strong>Family Involvement:</strong> {mlAnalysis.culturalFactors.familyInvolvement ? 'High' : 'Low'}
                    </div>
                    <div className="bg-neutral-50 p-2 rounded">
                      <strong>Religious:</strong> {mlAnalysis.culturalFactors.religiousConsiderations.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Differential Diagnosis */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-neutral-900">Differential Diagnosis</h3>
            </div>
            <div className="card-body space-y-3">
              {assessment.differentialDiagnosis.map((dx, index) => (
                <div key={index} className="border border-neutral-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-neutral-900">{dx.condition}</h4>
                    <span className="text-sm font-medium text-blue-600">
                      {Math.round(dx.probability * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{dx.reasoning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-neutral-900">Clinical Recommendations</h3>
            </div>
            <div className="card-body space-y-3">
              {assessment.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-neutral-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Red Flags */}
          {assessment.redFlags.length > 0 && (
            <div className="card border-red-200">
              <div className="card-header bg-red-50">
                <h3 className="text-lg font-semibold text-red-900">⚠️ Red Flags</h3>
              </div>
              <div className="card-body space-y-2">
                {assessment.redFlags.map((flag, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-red-700">{flag}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disposition */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-neutral-900">Recommended Disposition</h3>
            </div>
            <div className="card-body">
              <div className="text-center">
                <div className={`inline-block px-4 py-2 rounded-lg font-medium ${
                  assessment.disposition === 'emergency' ? 'bg-red-100 text-red-800' :
                  assessment.disposition === 'urgent_care' ? 'bg-orange-100 text-orange-800' :
                  assessment.disposition === 'primary_care' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {assessment.disposition.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              setCurrentStep('intake');
              setPatientInfo({allergies: [], medications: [], medicalHistory: []});
              setChiefComplaint('');
              setSymptoms([]);
              setVitalSigns({});
              setAssessment(null);
            }}
            className="btn-primary"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            AI Medical Triage System
          </h1>
          <p className="text-lg text-neutral-600">
            Professional clinical assessment powered by artificial intelligence
          </p>
        </div>

        {renderStepIndicator()}

        {/* Content */}
        {currentStep === 'intake' && renderPatientIntake()}
        {currentStep === 'symptoms' && renderSymptomAssessment()}
        {currentStep === 'vitals' && renderVitalSigns()}
        {currentStep === 'assessment' && renderAssessment()}
        {currentStep === 'results' && renderResults()}

        {/* Medical Disclaimer */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">⚕️ Medical Disclaimer</h4>
            <p className="text-sm text-yellow-700">
              This AI triage system is designed for educational and assistive purposes only. 
              It does not replace professional medical judgment or diagnosis. Always consult 
              with qualified healthcare professionals for medical decisions and emergency situations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITriagePage;