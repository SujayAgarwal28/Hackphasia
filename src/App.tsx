import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import TriagePage from './pages/TriagePage'
import AITriagePage from './pages/AITriagePage'
import BodyMappingPage from './pages/BodyMappingPage'
import VisualHealthPage from './pages/VisualHealthPage'
import MultilingualPage from './pages/MultilingualPage'
import MapPage from './pages/MapPage'
import FirstAidPage from './pages/FirstAidPage'
import MentalHealthPage from './pages/MentalHealthPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/triage" element={<TriagePage />} />
          <Route path="/ai-triage" element={<AITriagePage />} />
          <Route path="/body-mapping" element={<BodyMappingPage />} />
          <Route path="/visual-health" element={<VisualHealthPage />} />
          <Route path="/multilingual" element={<MultilingualPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/first-aid" element={<FirstAidPage />} />
          <Route path="/mental-health" element={<MentalHealthPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App