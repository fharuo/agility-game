import { useState, useCallback } from 'react';
import StartScreen    from './components/StartScreen';
import LeadScreen     from './components/LeadScreen';
import GameScreen     from './components/GameScreen';
import RankingScreen  from './components/RankingScreen';
import ThankYouScreen from './components/ThankYouScreen';
import { saveLead }   from './utils/leads';
import './App.css';

const SCREENS = { START: 'start', LEAD: 'lead', GAME: 'game', RANKING: 'ranking', THANKS: 'thanks' };

export default function App() {
  const [screen, setScreen]       = useState(SCREENS.START);
  const [leadData, setLeadData]   = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  const handleStart = useCallback(() => setScreen(SCREENS.LEAD), []);

  const handleLeadSubmit = useCallback((data) => {
    setLeadData(data);
    setScreen(SCREENS.GAME);
  }, []);

  const handleGameFinish = useCallback((scoreMs, hits) => {
    if (leadData) {
      saveLead({ ...leadData, score: scoreMs, hits });
    }
    setFinalScore(scoreMs);
    setScreen(SCREENS.RANKING);
  }, [leadData]);

  const handleContinue = useCallback(() => setScreen(SCREENS.THANKS), []);

  const handleRestart = useCallback(() => {
    setLeadData(null);
    setFinalScore(null);
    setScreen(SCREENS.START);
  }, []);

  return (
    <div className="app-shell">
      <div className="app-canvas">
        {screen === SCREENS.START   && <StartScreen   onStart={handleStart} />}
        {screen === SCREENS.LEAD    && <LeadScreen    onSubmit={handleLeadSubmit} />}
        {screen === SCREENS.GAME    && <GameScreen    onFinish={handleGameFinish} />}
        {screen === SCREENS.RANKING && <RankingScreen currentName={leadData?.nome} currentScore={finalScore} onContinue={handleContinue} />}
        {screen === SCREENS.THANKS  && <ThankYouScreen onRestart={handleRestart} />}
      </div>
    </div>
  );
}
