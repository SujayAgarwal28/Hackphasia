import { useState, useEffect } from 'react';
import { multilingualAI, LanguageSupport } from '../ai/MultilingualAIService';

const MultilingualInterface: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ar');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState<LanguageSupport[]>([]);

  const quickPhrases = [
    'I need help',
    'I have pain here',
    'Emergency',
    'I need a doctor',
    'Where is the hospital?',
    'I don\'t understand',
    'Please help me',
    'I have fever'
  ];

  useEffect(() => {
    setSupportedLanguages(multilingualAI.getSupportedLanguages());
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim() || !selectedLanguage) return;

    setIsTranslating(true);
    try {
      const result = await multilingualAI.translateText({
        text: inputText,
        fromLanguage: 'en',
        toLanguage: selectedLanguage,
        context: 'medical',
        culturalAdaptation: true
      });
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const selectedLanguageInfo = supportedLanguages.find(lang => lang.code === selectedLanguage);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Medical Translation Tool
        </h2>
        <p className="text-neutral-600">
          Translate medical phrases to communicate with healthcare providers
        </p>
      </div>

      {/* Language Selection */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-neutral-900">
            Select Your Language
          </h3>
        </div>
        <div className="card-body">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="form-select w-full max-w-md"
          >
            {supportedLanguages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name} ({language.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Translation Tool */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-neutral-900">
            Translate Medical Text
          </h3>
        </div>
        <div className="card-body space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              English (Type what you want to say)
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message in English..."
              className="form-textarea h-24 w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleTranslate();
                }
              }}
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || !selectedLanguage || isTranslating}
            className="btn-primary w-full"
          >
            {isTranslating ? 'Translating...' : `Translate to ${selectedLanguageInfo?.name || 'Selected Language'}`}
          </button>

          {translatedText && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {selectedLanguageInfo?.name} (Show this to medical staff)
              </label>
              <div 
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-lg font-medium"
                dir={selectedLanguage === 'ar' || selectedLanguage === 'fa' ? 'rtl' : 'ltr'}
              >
                {translatedText}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Point your phone screen toward the medical staff to show this translation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Phrases */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-neutral-900">
            Quick Medical Phrases
          </h3>
          <p className="text-sm text-neutral-600">
            Tap any phrase to translate it instantly
          </p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickPhrases.map((phrase, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputText(phrase);
                  setTranslatedText(''); // Clear previous translation
                }}
                className="p-3 text-sm border border-neutral-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultilingualInterface;