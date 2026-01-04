import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Zap,
    Plus,
    Minus,
    Container,
    Search,
    TrendingUp,
    TrendingDown,
    Activity,
    ClipboardList,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import '../../css/ecs/ECSServiceUpdates.css';

const ECSServiceUpdates = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const deltaUpdates = [
        {
            id: 1,
            cluster: 'production-api-cluster',
            added: ['payment-processor-svc', 'billing-callback-api', 'fraud-detection-worker'],
            deleted: ['legacy-auth-v1', 'temp-caching-layer'],
            timestamp: '2 hours ago'
        },
        {
            id: 2,
            cluster: 'production-web-cluster',
            added: ['marketing-campaign-pwa', 'seo-optimizer-bot'],
            deleted: ['blog-legacy-php', 'old-static-assets'],
            timestamp: '5 hours ago'
        },
        {
            id: 3,
            cluster: 'analytics-cluster',
            added: ['data-ingestion-v3', 'ml-prediction-engine'],
            deleted: [],
            timestamp: '1 day ago'
        },
        {
            id: 4,
            cluster: 'development-cluster',
            added: [],
            deleted: ['unstable-experimental-app', 'debug-logger-sidecar'],
            timestamp: '3 days ago'
        }
    ];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const totalAdded = deltaUpdates.reduce((sum, d) => sum + d.added.length, 0);
    const totalDeleted = deltaUpdates.reduce((sum, d) => sum + d.deleted.length, 0);

    const filteredUpdates = deltaUpdates.filter(update =>
        update.cluster.toLowerCase().includes(searchQuery.toLowerCase()) ||
        update.added.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        update.deleted.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleBack = () => navigate('/ecs');

    if (isLoading) {
        return (
            <div className="updates-loader-wrapper">
                <div className="loader-orbit">
                    <Activity size={40} className="spin-slow" />
                    <span>Analyzing Infrastructure Delta...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="delta-report-page">
            {/* Header Card */}
            <div className="page-header-modern">
                <div className="header-content-report">
                    <div className="header-left-report">
                        <div className="header-icon-report">
                            <ClipboardList size={36} strokeWidth={2.5} />
                        </div>
                        <div className="header-text-column">
                            <button onClick={handleBack} className="tiny-back-btn">
                                <ChevronLeft size={14} />
                                <span>Back to Clusters</span>
                            </button>
                            <h1 className="page-title-modern">Service Updates</h1>
                            <p className="page-subtitle-modern">Real-time delta view of service additions and removals</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="delta-metrics-grid">
                <div className="metric-card metric-added">
                    <div className="metric-icon">
                        <TrendingUp size={28} />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Services Added</span>
                        <h2 className="metric-value">{totalAdded}</h2>
                    </div>
                </div>

                <div className="metric-card metric-deleted">
                    <div className="metric-icon">
                        <TrendingDown size={28} />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Services Deleted</span>
                        <h2 className="metric-value">{totalDeleted}</h2>
                    </div>
                </div>
            </div>

            {/* Drift Report Body */}
            <div className="report-body-container">
                <div className="report-utility-bar">
                    <div className="search-box-minimal">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search clusters or services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="cluster-delta-stack">
                    {filteredUpdates.map((update) => (
                        <div key={update.id} className="cluster-delta-item">
                            <div className="cluster-item-header">
                                <div className="cluster-name-block">
                                    <Container size={20} className="c-icon" />
                                    <h3>{update.cluster}</h3>
                                    <span className="c-time">{update.timestamp}</span>
                                </div>
                            </div>

                            <div className="cluster-item-body">
                                <div className="delta-col added-col">
                                    <h4 className="col-title"><Plus size={14} /> Added Services</h4>
                                    <div className="pill-container">
                                        {update.added.length > 0 ? (
                                            update.added.map(s => (
                                                <div key={s} className="delta-pill added">
                                                    <span>{s}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="no-change text-muted">No additions</span>
                                        )}
                                    </div>
                                </div>

                                <div className="delta-col deleted-col">
                                    <h4 className="col-title"><Minus size={14} /> Deleted Services</h4>
                                    <div className="pill-container">
                                        {update.deleted.length > 0 ? (
                                            update.deleted.map(s => (
                                                <div key={s} className="delta-pill deleted">
                                                    <span>{s}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="no-change text-muted">No deletions</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredUpdates.length === 0 && (
                        <div className="no-report-data">
                            <AlertCircle size={40} />
                            <p>No drift detected for the selected filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ECSServiceUpdates;
