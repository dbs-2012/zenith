import React from 'react';
import '../../css/EKG.css';

const EKGSignal = ({ className = '', type = 'active', size = 'medium', variant = 'ekg' }) => {
    // Standard Heartbeat Points
    const ekgPoints = "486.6,113.8 328.2,113.8 310.3,132.3 296,70.7 246.8,127.4 241.6,120.2 233.9,166.4 227,27.6 213.2,118.3 211.8,112.3 205.1,126.1 198.2,108.5 194.1,124.4 184.5,92.9 174.1,113 4.3,113";

    // Trending Up Points (Sloping upward with arrow head)
    const trendPoints = "20,180 150,150 250,170 450,40 400,40 450,40 450,90";

    const points = variant === 'trend' ? trendPoints : ekgPoints;

    return (
        <div className={`ekg-container ekg-${size} ${className}`}>
            <svg
                viewBox="0 0 500 200"
                preserveAspectRatio="xMidYMid meet"
                className="ekg-svg"
            >
                <polyline
                    className={`ekg-line ekg-${type}`}
                    points={points}
                />
            </svg>
        </div>
    );
};

export default EKGSignal;
