import MultilingualInterface from '../components/MultilingualInterface';

const MultilingualPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900">
          Medical Translation Assistant
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Simple, reliable translation tool to help refugees communicate with healthcare providers.
          Type in English and get instant translations in your native language.
        </p>
      </div>

      {/* Main Interface */}
      <MultilingualInterface />

      {/* How It Works */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-neutral-900">
            How to Use This Tool
          </h3>
        </div>
        <div className="card-body">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-neutral-900 mb-2">Select Language</h4>
              <p className="text-sm text-neutral-600">
                Choose your native language from the dropdown menu
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-neutral-900 mb-2">Type or Tap</h4>
              <p className="text-sm text-neutral-600">
                Type what you want to say in English, or tap a quick phrase
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-neutral-900 mb-2">Show Translation</h4>
              <p className="text-sm text-neutral-600">
                Show the translated text to medical staff on your phone screen
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultilingualPage;