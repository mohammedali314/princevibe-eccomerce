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
    <div className="countdown-offer-banner">
      <div className="offer-headline">Limited Time Offer</div>
      <div className="offer-subheadline">
        Order within <b>10 minutes</b> to get <span style={{color: 'yellow'}}>Free Shipping!</span>
      </div>
      <div className="countdown-timer-row">
        <div className="countdown-segment">
          <span className="countdown-value">{pad(days)}</span>
          <span className="countdown-label">DAYS</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-segment">
          <span className="countdown-value">{pad(hours)}</span>
          <span className="countdown-label">HOURS</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-segment">
          <span className="countdown-value">{pad(minutes)}</span>
          <span className="countdown-label">MINUTES</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-segment">
          <span className="countdown-value">{pad(seconds)}</span>
          <span className="countdown-label">SECONDS</span>
        </div>
      </div>
      <div className="offer-badge">
        <span role="img" aria-label="truck">🚚</span> FREE SHIPPING
      </div>
    </div>
  );
};

export default CountdownTimer; 