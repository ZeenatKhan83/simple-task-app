import React, { useState, useEffect } from 'react';

function FocusTimer({ tasks = [] }) {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25 Minutes
  const [isActive, setIsActive] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [mode, setMode] = useState('work'); // 'work' or 'break'

  // Web Audio API Chime Alarm
  const playAlarmSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Friendly 3-tone chime sequence
      const now = ctx.currentTime;
      playTone(523.25, now, 0.4);       // C5
      playTone(659.25, now + 0.25, 0.4); // E5
      playTone(783.99, now + 0.5, 0.8);  // G5
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      playAlarmSound(); // Trigger alarm
      alert(mode === 'work' ? '🎉 Focus session finished! Take a break.' : '⚡ Break over! Time to focus.');
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = (newMode = mode) => {
    setIsActive(false);
    setMode(newMode);
    setSecondsLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card-surface" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⏱️ Focus Timer
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => resetTimer('work')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: mode === 'work' ? 'var(--primary)' : 'var(--surface)',
              color: mode === 'work' ? '#FFF' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}
          >
            Focus (25m)
          </button>
          <button 
            onClick={() => resetTimer('break')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: mode === 'break' ? 'var(--accent)' : 'var(--surface)',
              color: mode === 'break' ? '#FFF' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}
          >
            Break (5m)
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {/* Timer Display */}
        <div style={{
          fontSize: '3rem',
          fontWeight: '800',
          letterSpacing: '2px',
          color: 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {formatTime(secondsLeft)}
        </div>

        {/* Task Connector Dropdown */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Focusing on Task:
          </label>
          <select 
            className="input-field"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            <option value="">-- Unlinked Session --</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={toggleTimer} className="btn-primary" style={{ padding: '10px 24px' }}>
            {isActive ? 'Pause' : 'Start Session'}
          </button>
          <button 
            onClick={() => resetTimer(mode)} 
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--borders)',
              color: 'var(--text-primary)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default FocusTimer;