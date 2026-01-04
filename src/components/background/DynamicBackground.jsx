import React from 'react';
import '../../css/BackgroundEffects.css';

const DynamicBackground = ({ context = 'default' }) => {
    return (
        <div className={`dynamic-bg-wrapper context-${context}`}>
            {/* Layer 1: Infinite 3D Moving Grid */}
            <div className="bg-layer grid-layer">
                <div className="grid-perspective">
                    <div className="grid-surface"></div>
                </div>
            </div>

            {/* Layer 2: Contextual Response */}
            <div className={`bg-layer context-overlay context-${context}`}></div>

            {/* Layer 3: Pro Finishing Touches */}
            <div className="bg-layer noise-layer"></div>
            <div className="bg-layer vignette-layer"></div>
        </div>
    );
};

export default DynamicBackground;
