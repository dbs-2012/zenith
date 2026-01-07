import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Plus,
    Minus,
    Container,
    Search,
    TrendingUp,
    TrendingDown,
    Activity,
    ClipboardList,
    AlertCircle,
    CheckCircle2,
    Edit
} from 'lucide-react';
import '../../css/ecs/ECSServiceUpdates.css';

// ============================================================================
// STATIC DATA (Remove when API is integrated)
// ============================================================================
const MOCK_SYNC_RESPONSE = {
    success: true,
    message: 'Sync completed successfully',
    summary: {
        clusters_added: 0,
        clusters_unchanged: 5,
        total_clusters: 5,
        services_added: 7,
        services_updated: 3,
        services_deleted: 4,
        total_time_ms: 3450,
        added_services: [
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/payment-processor-svc',
                service_name: 'payment-processor-svc',
                cluster_name: 'production-api-cluster'
            },
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/billing-callback-api',
                service_name: 'billing-callback-api',
                cluster_name: 'production-api-cluster'
            },
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/fraud-detection-worker',
                service_name: 'fraud-detection-worker',
                cluster_name: 'production-api-cluster'
            },
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/marketing-campaign-pwa',
                service_name: 'marketing-campaign-pwa',
                cluster_name: 'production-web-cluster'
            },
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/seo-optimizer-bot',
                service_name: 'seo-optimizer-bot',
                cluster_name: 'production-web-cluster'
            },
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/analytics-cluster/data-ingestion-v3',
                service_name: 'data-ingestion-v3',
                cluster_name: 'analytics-cluster'
            },
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/analytics-cluster/ml-prediction-engine',
                service_name: 'ml-prediction-engine',
                cluster_name: 'analytics-cluster'
            }
        ],
        updated_services: [
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/auth-service',
                service_name: 'auth-service',
                cluster_name: 'production-api-cluster',
                old_values: { min: 2, desired: 2, max: 4, status: 'running' },
                new_values: { min: 2, desired: 3, max: 6, status: 'running' }
            },
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/staging-cluster/test-api',
                service_name: 'test-api',
                cluster_name: 'staging-cluster',
                old_values: { min: 1, desired: 1, max: 2, status: 'running' },
                new_values: { min: 1, desired: 0, max: 2, status: 'stopped' }
            },
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/development-cluster/dev-api',
                service_name: 'dev-api',
                cluster_name: 'development-cluster',
                old_values: { min: 1, desired: 1, max: 2, status: 'running' },
                new_values: { min: 1, desired: 2, max: 4, status: 'running' }
            }
        ],
        deleted_services: [
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/legacy-auth-v1',
                service_name: 'legacy-auth-v1',
                cluster_name: 'production-api-cluster'
            },
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/temp-caching-layer',
                service_name: 'temp-caching-layer',
                cluster_name: 'production-api-cluster'
            },
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/blog-legacy-php',
                service_name: 'blog-legacy-php',
                cluster_name: 'production-web-cluster'
            },
            {
                service_arn: 'arn:aws:ecs:us-east-1:123456789:service/development-cluster/debug-logger-sidecar',
                service_name: 'debug-logger-sidecar',
                cluster_name: 'development-cluster'
            }
        ]
    }
};

// ============================================================================
// HELPER FUNCTIONS (Outside component - created once)
// ============================================================================

// Debounce hook for search optimization
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

// Group services by cluster
const groupServicesByCluster = (addedServices, updatedServices, deletedServices) => {
    const clusterMap = {};

    // Process added services
    addedServices.forEach(service => {
        if (!clusterMap[service.cluster_name]) {
            clusterMap[service.cluster_name] = {
                cluster_name: service.cluster_name,
                added: [],
                updated: [],
                deleted: []
            };
        }
        clusterMap[service.cluster_name].added.push(service);
    });

    // Process updated services
    updatedServices.forEach(service => {
        if (!clusterMap[service.cluster_name]) {
            clusterMap[service.cluster_name] = {
                cluster_name: service.cluster_name,
                added: [],
                updated: [],
                deleted: []
            };
        }
        clusterMap[service.cluster_name].updated.push(service);
    });

    // Process deleted services
    deletedServices.forEach(service => {
        if (!clusterMap[service.cluster_name]) {
            clusterMap[service.cluster_name] = {
                cluster_name: service.cluster_name,
                added: [],
                updated: [],
                deleted: []
            };
        }
        clusterMap[service.cluster_name].deleted.push(service);
    });

    // Convert to array, filter out clusters with no changes, and sort by cluster name
    return Object.values(clusterMap)
        .filter(cluster =>
            cluster.added.length > 0 ||
            cluster.updated.length > 0 ||
            cluster.deleted.length > 0
        )
        .sort((a, b) => a.cluster_name.localeCompare(b.cluster_name));
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ECSServiceUpdates = () => {
    const navigate = useNavigate();

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [syncData, setSyncData] = useState(null);

    // Debounced search query (300ms delay)
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // ========================================================================
    // API CALLS
    // ========================================================================

    const fetchSyncData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        // ⏸️ TODO: Replace with actual API call to get last sync data
        // Uncomment when API is ready:
        /*
        try {
            const response = await fetch('/api/ecs/last-sync', {
                method: 'GET'  // Get the last sync data, not trigger a new sync
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch sync data: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            // Expected API response format:
            // {
            //     success: true,
            //     message: "Last sync data retrieved",
            //     summary: {
            //         clusters_added: 0,
            //         clusters_unchanged: 5,
            //         total_clusters: 5,
            //         services_added: 7,
            //         services_updated: 3,
            //         services_deleted: 4,
            //         total_time_ms: 3450,
            //         added_services: [...],
            //         updated_services: [...],
            //         deleted_services: [...]
            //     }
            // }
            
            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to fetch sync data');
            }
            
            setSyncData(result.summary);
        } catch (err) {
            console.error('Error fetching sync data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
        */

        // 🎭 SIMULATION
        setTimeout(() => {
            setSyncData(MOCK_SYNC_RESPONSE.summary);
            setIsLoading(false);
            console.log('Loaded last sync data (simulated)');
        }, 1200);
    }, []);

    // ========================================================================
    // EFFECTS
    // ========================================================================

    useEffect(() => {
        fetchSyncData();
    }, [fetchSyncData]);

    // ========================================================================
    // MEMOIZED CALCULATIONS
    // ========================================================================

    // Group services by cluster (memoized)
    const clusterUpdates = useMemo(() => {
        if (!syncData) return [];

        return groupServicesByCluster(
            syncData.added_services || [],
            syncData.updated_services || [],
            syncData.deleted_services || []
        );
    }, [syncData]);

    // Calculate total stats (memoized)
    const stats = useMemo(() => {
        if (!syncData) return { totalAdded: 0, totalUpdated: 0, totalDeleted: 0, totalClusters: 0 };

        return {
            totalAdded: syncData.services_added || 0,
            totalUpdated: syncData.services_updated || 0,
            totalDeleted: syncData.services_deleted || 0,
            totalClusters: clusterUpdates.length
        };
    }, [syncData, clusterUpdates]);

    // Filtered updates (memoized)
    const filteredUpdates = useMemo(() => {
        if (!debouncedSearchQuery) return clusterUpdates;

        const query = debouncedSearchQuery.toLowerCase();

        return clusterUpdates.filter(update => {
            const clusterMatch = update.cluster_name.toLowerCase().includes(query);
            const addedMatch = update.added.some(s => s.service_name.toLowerCase().includes(query));
            const updatedMatch = update.updated.some(s => s.service_name.toLowerCase().includes(query));
            const deletedMatch = update.deleted.some(s => s.service_name.toLowerCase().includes(query));

            return clusterMatch || addedMatch || updatedMatch || deletedMatch;
        });
    }, [clusterUpdates, debouncedSearchQuery]);

    // ========================================================================
    // EVENT HANDLERS (All memoized with useCallback)
    // ========================================================================

    const handleBack = useCallback(() => {
        navigate('/ecs');
    }, [navigate]);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    // ========================================================================
    // RENDER - LOADING STATE
    // ========================================================================

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

    // ========================================================================
    // RENDER - ERROR STATE
    // ========================================================================

    if (error) {
        return (
            <div className="delta-report-page">
                <div className="error-state">
                    <AlertCircle size={48} className="error-icon" />
                    <h2>Failed to Load Sync Data</h2>
                    <p>{error}</p>
                    <button onClick={fetchSyncData} className="retry-btn">
                        Retry
                    </button>
                    <button onClick={handleBack} className="back-btn">
                        <ChevronLeft size={20} />
                        Back to Clusters
                    </button>
                </div>
            </div>
        );
    }

    // ========================================================================
    // RENDER - MAIN CONTENT
    // ========================================================================

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
                            <p className="page-subtitle-modern">
                                Delta view of last sync • {stats.totalClusters} {stats.totalClusters === 1 ? 'Cluster' : 'Clusters'}
                            </p>
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
                        <h2 className="metric-value">{stats.totalAdded}</h2>
                    </div>
                </div>

                <div className="metric-card metric-updated">
                    <div className="metric-icon">
                        <Edit size={28} />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Services Updated</span>
                        <h2 className="metric-value">{stats.totalUpdated}</h2>
                    </div>
                </div>

                <div className="metric-card metric-deleted">
                    <div className="metric-icon">
                        <TrendingDown size={28} />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Services Deleted</span>
                        <h2 className="metric-value">{stats.totalDeleted}</h2>
                    </div>
                </div>
            </div>

            {/* Sync Info */}
            {syncData && syncData.total_time_ms && (
                <div className="sync-info-banner">
                    <CheckCircle2 size={18} />
                    <span>Last sync completed in {syncData.total_time_ms}ms</span>
                    <span className="separator">•</span>
                    <span>{syncData.total_clusters} clusters processed</span>
                    {syncData.clusters_added > 0 && (
                        <>
                            <span className="separator">•</span>
                            <span className="text-success">{syncData.clusters_added} new clusters added</span>
                        </>
                    )}
                </div>
            )}

            {/* Drift Report Body */}
            <div className="report-body-container">
                <div className="report-utility-bar">
                    <div className="search-box-minimal">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search clusters or services..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    {searchQuery && (
                        <span className="search-results-info">
                            {filteredUpdates.length} {filteredUpdates.length === 1 ? 'result' : 'results'}
                        </span>
                    )}
                </div>

                <div className="cluster-delta-stack">
                    {filteredUpdates.map((update, index) => (
                        <div key={update.cluster_name} className="cluster-delta-item">
                            <div className="cluster-item-header">
                                <div className="cluster-name-block">
                                    <Container size={20} className="c-icon" />
                                    <h3>{update.cluster_name}</h3>
                                    <span className="change-summary">
                                        {update.added.length > 0 && (
                                            <span className="summary-badge added">+{update.added.length}</span>
                                        )}
                                        {update.updated.length > 0 && (
                                            <span className="summary-badge updated">~{update.updated.length}</span>
                                        )}
                                        {update.deleted.length > 0 && (
                                            <span className="summary-badge deleted">-{update.deleted.length}</span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="cluster-item-body">
                                {/* Added Services */}
                                <div className="delta-col added-col">
                                    <h4 className="col-title">
                                        <Plus size={14} /> Added Services
                                        {update.added.length > 0 && (
                                            <span className="count-badge">{update.added.length}</span>
                                        )}
                                    </h4>
                                    <div className="pill-container">
                                        {update.added.length > 0 ? (
                                            update.added.map(s => (
                                                <div key={s.service_arn} className="delta-pill added">
                                                    <CheckCircle2 size={12} />
                                                    <span>{s.service_name}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="no-change text-muted">No additions</span>
                                        )}
                                    </div>
                                </div>

                                {/* Updated Services */}
                                <div className="delta-col updated-col">
                                    <h4 className="col-title">
                                        <Edit size={14} /> Updated Services
                                        {update.updated.length > 0 && (
                                            <span className="count-badge">{update.updated.length}</span>
                                        )}
                                    </h4>
                                    <div className="pill-container">
                                        {update.updated.length > 0 ? (
                                            update.updated.map(s => (
                                                <div key={s.service_arn} className="delta-pill updated">
                                                    <Activity size={12} />
                                                    <span>{s.service_name}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="no-change text-muted">No updates</span>
                                        )}
                                    </div>
                                </div>

                                {/* Deleted Services */}
                                <div className="delta-col deleted-col">
                                    <h4 className="col-title">
                                        <Minus size={14} /> Deleted Services
                                        {update.deleted.length > 0 && (
                                            <span className="count-badge">{update.deleted.length}</span>
                                        )}
                                    </h4>
                                    <div className="pill-container">
                                        {update.deleted.length > 0 ? (
                                            update.deleted.map(s => (
                                                <div key={s.service_arn} className="delta-pill deleted">
                                                    <AlertCircle size={12} />
                                                    <span>{s.service_name}</span>
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
                            <CheckCircle2 size={40} />
                            <p>No service changes detected{searchQuery ? ' for the selected filters' : ''}.</p>
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ECSServiceUpdates;