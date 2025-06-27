import React, { useEffect, useState, useRef } from 'react';
import './CountdownTimer.scss';

const getDurationInSeconds = (duration) => {
  return (
    (duration.days || 0) * 86400 +
    (duration.hours || 0) * 3600 +
    (duration.minutes || 0) * 60 +
    (duration.seconds || 0)
  );
};

const pad = (num) => String(num).padStart(2, '0');

const CountdownTimer = ({
  duration = { days: 3, hours: 0, minutes: 0, seconds: 0 },
  message = (
    <>
      <span style={{ fontWeight: 700, color: '#fff' }}>
        <span role="img" aria-label="clock">⏰</span>
        <span style={{ 
          color: '#FFD700', 
          fontWeight: 800, 
          marginLeft: 8, 
          fontFamily: `'Playfair Display', 'Montserrat', 'Inter', Arial, sans-serif`, 
          fontSize: '1.18em', 
          letterSpacing: '0.01em', 
          display: 'inline-block', 
          verticalAlign: 'middle',
          textShadow: '0 1px 8px #000, 0 0px 2px #FFD700'
        }}>
          Don’t Miss Out!
        </span>
        <span style={{ color: '#fff', fontWeight: 700, marginLeft: 8 }}>- Sale Ends Soon!</span>
      </span>
    </>
  )
}) => {
  const initialSeconds = getDurationInSeconds(duration);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return initialSeconds; // Restart timer
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [initialSeconds]);

  // Calculate days, hours, minutes, seconds
  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="luxury-timer-bar">
      <span className="timer-message">{message}</span>
      <span className="timer-segment"><span className="timer-value">{pad(days)}</span><span className="timer-label">d</span></span>
      <span className="timer-segment"><span className="timer-value">{pad(hours)}</span><span className="timer-label">h</span></span>
      <span className="timer-segment"><span className="timer-value">{pad(minutes)}</span><span className="timer-label">m</span></span>
      <span className="timer-segment"><span className="timer-value">{pad(seconds)}</span><span className="timer-label">s</span></span>
    </div>
  );
};

export default CountdownTimer; 