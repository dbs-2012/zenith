import React from 'react';
import '../../css/common/ThunderboltSignal.css';

const ThunderboltSignal = ({ size = 'medium', type = 'active' }) => {
    return (
        <div className={`thunderbolt-premium-container bolt-${size} ${type}`}>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="bolt-svg-premium"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="premium-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* The classic lightning bolt path */}
                <path
                    d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                    className="bolt-draw-line"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <div className="strike-flash" />
        </div>
    );
};

export default ThunderboltSignal;
