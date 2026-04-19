import { SpeakerSchedule } from './pages/speaker-schedule'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { UnitSchedule } from './pages/unit-schedule'
import { Footer } from './components/footer'
import { Home } from './pages/home'
import { Font } from '@react-pdf/renderer'

Font.registerHyphenationCallback((word) => [word]);

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/speaker-schedule" element={<SpeakerSchedule />} />
        <Route path="/unit-schedule" element={<UnitSchedule />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
