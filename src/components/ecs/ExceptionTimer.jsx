import React from 'react';
import '../../css/ecs/ExceptionTimer.css';

const ExceptionTimer = ({ remaining, total }) => {
    const percentage = total > 0 ? Math.min(Math.max((remaining / total) * 100, 0), 100) : 0;
    const radius = 7;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // Color logic
    let statusClass = 'timer-safe';
    if (remaining <= 1) { // Critical when 24 hrs (1 day) or less left
        statusClass = 'timer-critical';
    } else if (percentage <= 50) {
        statusClass = 'timer-warning';
    }

    return (
        <div className="exception-timer-container">
            <svg className="exception-timer-svg" viewBox="0 0 20 20">
                <circle
                    className="timer-track"
                    cx="10"
                    cy="10"
                    r={radius}
                />
                <circle
                    className={`timer-progress ${statusClass}`}
                    cx="10"
                    cy="10"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
        </div>
    );
};

export default ExceptionTimer;
