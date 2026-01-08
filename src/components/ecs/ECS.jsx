import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Search,
    RefreshCw,
    Upload,
    Calendar,
    Server,
    PlayCircle,
    StopCircle,
    Cpu,
    Clock,
    GitCompare,
    XCircle,
    AlertTriangle
} from 'lucide-react';
import EKGSignal from '../common/EKGSignal';
import ThunderboltSignal from '../common/ThunderboltSignal';
import ECSIcon from '../common/ECSIcon';
import ExceptionTimer from './ExceptionTimer';
import ScheduleModal from './ScheduleModal';
import '../../css/ecs/ECS.css';
import '../../css/ecs/ScheduleModal.css';

// ============================================================================
// CONSTANTS
// ============================================================================
const CLUSTER_CACHE_KEY = 'lombard_ecs_clusters_cache';
const SCHEDULE_CACHE_KEY = 'lombard_ecs_schedules';
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

// ============================================================================
// STATIC DATA (Remove when API is integrated)
// ============================================================================
const INITIAL_CLUSTERS = [
    {
        id: 1,
        name: 'production-api-cluster',
        activeServices: 8,
        runningServices: 8,
        closedServices: 0,
        computeType: 'FARGATE',
        isException: false
    },
    {
        id: 2,
        name: 'production-web-cluster',
        activeServices: 12,
        runningServices: 10,
        closedServices: 2,
        computeType: 'ASG',
        isException: false
    },
    {
        id: 3,
        name: 'staging-cluster',
        activeServices: 5,
        runningServices: 5,
        closedServices: 0,
        computeType: 'FARGATE',
        isException: false
    },
    {
        id: 4,
        name: 'analytics-cluster',
        activeServices: 3,
        runningServices: 3,
        closedServices: 0,
        computeType: 'FARGATE',
        isException: false
    },
    {
        id: 5,
        name: 'development-cluster',
        activeServices: 4,
        runningServices: 2,
        closedServices: 2,
        computeType: 'ASG',
        isException: false
    }
];

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

// Pure function for compute type colors
const getComputeTypeColor = (type) => {
    switch (type) {
        case 'FARGATE':
            return 'compute-fargate';
        case 'ASG':
            return 'compute-asg';
        default:
            return 'compute-fargate';
    }
};

// Calculate schedule status (for badge color and remaining days)
const calculateScheduleStatus = (scheduleData) => {
    if (!scheduleData) return null;

    const start = new Date(scheduleData.from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(scheduleData.to);
    end.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = Math.round((end - start) / 86400000);
    const remaining = Math.max(0, Math.round((end - Math.max(today, start)) / 86400000));

    let badgeClass = 'bg-safe';
    if (remaining <= 1) {
        badgeClass = 'bg-critical';
    } else if ((remaining / total) <= 0.5) {
        badgeClass = 'bg-warning';
    }

    return { remaining, total, badgeClass };
};

// Check if cache is still valid
const isCacheValid = (timestamp) => {
    if (!timestamp) return false;
    const age = Date.now() - new Date(timestamp).getTime();
    return age < CACHE_MAX_AGE;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function ECS() {
    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    const [searchQuery, setSearchQuery] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [scheduledRanges, setScheduledRanges] = useState({});
    const [clusters, setClusters] = useState(INITIAL_CLUSTERS); // Using static data for now

    // Error handling states
    const [error, setError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Debounced search query (300ms delay)
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // ========================================================================
    // API CALLS (Currently using static data and localStorage)
    // ========================================================================

    // Fetch clusters from API
    const fetchClusters = useCallback(async () => {
        setIsSyncing(true);
        setError(null);

        // ⏸️ TODO: Replace simulation with actual API call
        // Uncomment below when API is ready:
        /*
        try {
            const response = await fetch('/api/ecs/clusters');
            if (!response.ok) {
                throw new Error(`Failed to fetch clusters: ${response.statusText}`);
            }
            const data = await response.json();
            
            // Update state
            setClusters(data);
            setIsInitialLoad(false);
            
            // 💾 Cache to localStorage
            localStorage.setItem(CLUSTER_CACHE_KEY, JSON.stringify({
                data: data,
                timestamp: new Date().toISOString()
            }));
            
        } catch (err) {
            console.error('Error fetching clusters:', err);
            setError(err.message);
            
            // 📦 Try to load from cache if available
            const cached = localStorage.getItem(CLUSTER_CACHE_KEY);
            if (cached) {
                try {
                    const { data, timestamp } = JSON.parse(cached);
                    setClusters(data);
                    setIsInitialLoad(false);
                    console.log('Loaded clusters from cache (age:', 
                        Math.round((Date.now() - new Date(timestamp).getTime()) / 1000 / 60), 'minutes)');
                } catch (e) {
                    console.error('Failed to parse cached clusters');
                }
            }
        } finally {
            setIsSyncing(false);
        }
        */

        // 🎭 SIMULATION (Remove when API is ready)
        setTimeout(() => {
            setIsSyncing(false);
            setIsInitialLoad(false); // Mark as successfully loaded
            console.log('Clusters synced (simulated)');
        }, 1000);
    }, []);

    // Load schedules from localStorage/API
    const loadSchedules = useCallback(() => {
        // ⏸️ TODO: Replace with API call
        // Uncomment below when API is ready:
        /*
        const fetchSchedules = async () => {
            try {
                const response = await fetch('/api/ecs/schedules');
                if (!response.ok) throw new Error('Failed to fetch schedules');
                
                const data = await response.json();
                const hydrated = Object.entries(data).reduce((acc, [key, value]) => {
                    acc[key] = {
                        ...value,
                        from: new Date(value.from),
                        to: new Date(value.to)
                    };
                    return acc;
                }, {});
                
                setScheduledRanges(hydrated);
                
                // Cache to localStorage as backup
                localStorage.setItem(SCHEDULE_CACHE_KEY, JSON.stringify(data));
            } catch (error) {
                console.error('Error fetching schedules:', error);
                // Fallback to localStorage
                loadSchedulesFromLocalStorage();
            }
        };
        fetchSchedules();
        */

        // 🎭 CURRENT: Using localStorage (will become fallback)
        const saved = localStorage.getItem(SCHEDULE_CACHE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const hydrated = Object.entries(parsed).reduce((acc, [key, value]) => {
                    acc[key] = {
                        ...value,
                        from: new Date(value.from),
                        to: new Date(value.to)
                    };
                    return acc;
                }, {});
                setScheduledRanges(hydrated);
            } catch (e) {
                console.error("Failed to parse schedules from localStorage", e);
            }
        }
    }, []);

    // ========================================================================
    // EFFECTS
    // ========================================================================

    // Initial data load
    useEffect(() => {
        // Try to load cached clusters first (instant display)
        const cached = localStorage.getItem(CLUSTER_CACHE_KEY);
        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                setClusters(data);
                setIsInitialLoad(false); // We have cached data

                if (!isCacheValid(timestamp)) {
                    console.log('Cache is old, will fetch fresh data');
                }
            } catch (e) {
                console.error('Failed to load cache');
            }
        }

        // Load schedules and fetch fresh cluster data
        loadSchedules();
        fetchClusters();
    }, [loadSchedules, fetchClusters]);

    // ========================================================================
    // MEMOIZED CALCULATIONS
    // ========================================================================

    // Calculate stats (memoized)
    const stats = useMemo(() => ({
        totalServices: clusters.reduce((sum, c) => sum + c.activeServices, 0),
        totalClustersCount: clusters.length,
        activeExceptions: Object.keys(scheduledRanges).length
    }), [clusters, scheduledRanges]);

    // Filtered clusters with pre-calculated schedule status (memoized)
    const filteredClustersWithStatus = useMemo(() => {
        return clusters
            .filter(cluster =>
                cluster.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            )
            .map(cluster => ({
                ...cluster,
                scheduleStatus: calculateScheduleStatus(scheduledRanges[cluster.name]),
                hasException: cluster.isException || !!scheduledRanges[cluster.name]
            }));
    }, [clusters, debouncedSearchQuery, scheduledRanges]);

    // ========================================================================
    // EVENT HANDLERS (All memoized with useCallback)
    // ========================================================================

    const handleClusterClick = useCallback((clusterName) => {
        navigate(`/ecs/${clusterName}`);
    }, [navigate]);

    const handleSync = useCallback(async () => {
        setIsSyncing(true);
        setError(null);

        // ⏸️ TODO: Uncomment when ready to use the sync API
        /*
        try {
            const response = await fetch('/api/ecs/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Sync failed: ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to sync clusters');
            }

            console.log('Sync completed successfully:', result.summary);

            // After successful sync, navigate to the service updates page
            navigate('/ecs/updates');
        } catch (err) {
            console.error('Error syncing clusters:', err);
            setError(err.message);
        } finally {
            setIsSyncing(false);
        }
        */

        // 🎭 SIMULATION (Remove when API is ready)
        setTimeout(() => {
            setIsSyncing(false);
            console.log('Sync completed (simulated)');
            // Navigate to service updates page after sync
            navigate('/ecs/updates');
        }, 2000);
    }, [navigate]);

    const handleFileUpload = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);

            // ⏸️ TODO: Process and upload file to API
            // Uncomment when API is ready:
            /*
            const formData = new FormData();
            formData.append('file', file);
            
            fetch('/api/ecs/upload-exceptions', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('File uploaded successfully:', data);
                // Refresh schedules after upload
                loadSchedules();
            })
            .catch(error => {
                console.error('Error uploading file:', error);
            });
            */

            console.log('File uploaded:', file.name);
        }
    }, []);

    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleScheduleClick = useCallback((clusterId) => {
        const cluster = clusters.find(c => c.id === clusterId);
        setSelectedCluster(cluster);
        setIsScheduleModalOpen(true);
    }, [clusters]);

    const handleCloseModal = useCallback(() => {
        setIsScheduleModalOpen(false);
    }, []);

    const handleRemoveSchedule = useCallback((clusterName) => {
        // ⏸️ TODO: Replace with actual API call
        // Uncomment when API is ready:
        /*
        const deleteSchedule = async () => {
            try {
                const response = await fetch(`/api/ecs/schedules/${encodeURIComponent(clusterName)}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to delete schedule: ${response.statusText}`);
                }
                
                const result = await response.json();
                
                // Expected API response format:
                // {
                //     success: true,
                //     message: "Schedule deleted successfully",
                //     data: {
                //         clusterName: "production-api-cluster"
                //     }
                // }
                
                if (!result.success) {
                    throw new Error(result.error?.message || 'Failed to delete schedule');
                }
                
                console.log('Schedule deleted successfully:', result.data);
                
                // Update local state - remove the schedule
                setScheduledRanges(prev => {
                    const updated = { ...prev };
                    delete updated[clusterName];
                    
                    // Update localStorage as backup
                    const toStore = Object.entries(updated).reduce((acc, [key, value]) => {
                        acc[key] = {
                            ...value,
                            from: value.from.toISOString(),
                            to: value.to.toISOString()
                        };
                        return acc;
                    }, {});
                    localStorage.setItem(SCHEDULE_CACHE_KEY, JSON.stringify(toStore));
                    
                    return updated;
                });
                
                setIsScheduleModalOpen(false);
                
            } catch (error) {
                console.error('Error deleting schedule:', error);
                setError(error.message);
                // Don't close modal on error so user can retry
            }
        };
        deleteSchedule();
        */

        // 🎭 CURRENT: Using localStorage (will become fallback)
        setScheduledRanges(prev => {
            const updated = { ...prev };
            delete updated[clusterName];

            // Update localStorage
            const toStore = Object.entries(updated).reduce((acc, [key, value]) => {
                acc[key] = {
                    ...value,
                    from: value.from.toISOString(),
                    to: value.to.toISOString()
                };
                return acc;
            }, {});
            localStorage.setItem(SCHEDULE_CACHE_KEY, JSON.stringify(toStore));

            return updated;
        });

        setIsScheduleModalOpen(false);
        console.log(`Schedule removed for cluster: ${clusterName}`);
    }, []);

    const handleConfirmSchedule = useCallback((range) => {
        if (!selectedCluster) return;

        const start = new Date(range.from);
        start.setHours(0, 0, 0, 0);
        const endNormal = new Date(range.to);
        endNormal.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const total = Math.round((endNormal - start) / 86400000);
        const remaining = Math.max(0, Math.round((endNormal - Math.max(today, start)) / 86400000));

        const newSchedule = {
            from: start,
            to: endNormal,
            remainingDays: remaining,
            totalDays: total
        };

        // ⏸️ TODO: Replace with actual API call
        // Uncomment when API is ready:
        /*
        const saveSchedule = async () => {
            try {
                const response = await fetch('/api/ecs/schedules', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        clusterName: selectedCluster.name,  // Cluster name from selected cluster
                        from: start.toISOString().split('T')[0],  // Send only date: "2026-01-08"
                        to: endNormal.toISOString().split('T')[0],  // Send only date: "2026-01-15"
                        remainingDays: remaining,
                        totalDays: total
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to save schedule: ${response.statusText}`);
                }
                
                const result = await response.json();
                
                // Expected API response format:
                // {
                //     success: true,
                //     message: "Schedule created successfully",
                //     data: {
                //         clusterName: "production-api-cluster",
                //         from: "2026-01-08",
                //         to: "2026-01-15",
                //         remainingDays: 7,
                //         totalDays: 7
                //     }
                // }
                
                if (!result.success) {
                    throw new Error(result.error?.message || 'Failed to save schedule');
                }
                
                console.log('Schedule saved successfully:', result.data);
                
                // Update local state with the saved schedule
                setScheduledRanges(prev => {
                    const updated = {
                        ...prev,
                        [selectedCluster.name]: newSchedule
                    };
                    
                    // Update localStorage as backup
                    const toStore = Object.entries(updated).reduce((acc, [key, value]) => {
                        acc[key] = {
                            ...value,
                            from: value.from.toISOString(),
                            to: value.to.toISOString()
                        };
                        return acc;
                    }, {});
                    localStorage.setItem(SCHEDULE_CACHE_KEY, JSON.stringify(toStore));
                    
                    return updated;
                });
                
                setIsScheduleModalOpen(false);
                
            } catch (error) {
                console.error('Error saving schedule:', error);
                setError(error.message);
                // Don't close modal on error so user can retry
            }
        };
        saveSchedule();
        */

        // 🎭 CURRENT: Using localStorage (will become fallback)
        setScheduledRanges(prev => {
            const updated = {
                ...prev,
                [selectedCluster.name]: newSchedule
            };

            // Update localStorage
            const toStore = Object.entries(updated).reduce((acc, [key, value]) => {
                acc[key] = {
                    ...value,
                    from: value.from.toISOString(),
                    to: value.to.toISOString()
                };
                return acc;
            }, {});
            localStorage.setItem(SCHEDULE_CACHE_KEY, JSON.stringify(toStore));

            return updated;
        });

        setIsScheduleModalOpen(false);
        console.log(`Schedule confirmed for ${selectedCluster.name}:`, { from: start, to: endNormal, duration: total });
    }, [selectedCluster]);

    const handleNavigateToDeltaUpdates = useCallback(() => {
        navigate('/ecs/updates');
    }, [navigate]);

    // ========================================================================
    // RENDER - HYBRID ERROR HANDLING
    // ========================================================================

    // 🚨 FULL PAGE ERROR - Only if initial load failed and no data to show
    if (error && isInitialLoad && clusters.length === 0) {
        return (
            <div className="ecs-page">
                <div className="error-state-fullpage">
                    <div className="error-container-fullpage">
                        <XCircle size={64} className="error-icon" />
                        <h2>Failed to Load Clusters</h2>
                        <p className="error-message">{error}</p>
                        <button
                            onClick={fetchClusters}
                            className="retry-btn"
                            disabled={isSyncing}
                        >
                            <RefreshCw size={20} className={isSyncing ? 'spinning' : ''} />
                            {isSyncing ? 'Retrying...' : 'Retry'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================================
    // RENDER - MAIN CONTENT
    // ========================================================================

    return (
        <div className="ecs-page">
            {/* ⚠️ ERROR BANNER - Shows if sync failed but we have cached data */}
            {error && !isInitialLoad && (
                <div className="error-banner-top">
                    <div className="error-banner-content">
                        <AlertTriangle size={20} />
                        <div className="error-text">
                            <strong>Sync Failed:</strong> {error}
                            <span className="error-subtext">Showing last known data</span>
                        </div>
                        <button
                            onClick={fetchClusters}
                            className="retry-btn-inline"
                            disabled={isSyncing}
                        >
                            <RefreshCw size={16} className={isSyncing ? 'spinning' : ''} />
                            {isSyncing ? 'Retrying...' : 'Retry'}
                        </button>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="page-header-modern">
                <div className="header-content-cluster">
                    <div className="header-left-cluster">
                        <div className="header-icon-modern">
                            <ECSIcon size={64} />
                        </div>
                        <div className="header-text">
                            <h1 className="page-title-modern">ECS Cluster Scheduler</h1>
                        </div>
                    </div>

                    <button
                        className="btn-delta-updates"
                        onClick={handleNavigateToDeltaUpdates}
                    >
                        <div className="icon-wrapper">
                            <GitCompare size={20} />
                        </div>
                        <span>Delta Updates</span>
                    </button>
                </div>
            </div>

            {/* Stats & Actions Bar */}
            <div className="stats-actions-container">
                {/* Stats Cards */}
                <div className="stats-cards-modern">
                    <div className="stat-card-modern stat-primary-modern">
                        <div className="stat-icon-modern">
                            <ECSIcon size={60} />
                        </div>
                        <div className="stat-content-modern">
                            <h3 className="stat-value-modern">{stats.totalClustersCount}</h3>
                            <p className="stat-label-modern">Total Clusters</p>
                        </div>
                        <div className="stat-trend">
                            <EKGSignal size="small" variant="trend" type="success" />
                        </div>
                    </div>

                    <div className="stat-card-modern stat-success-modern">
                        <div className="stat-icon-modern">
                            <Server size={28} />
                        </div>
                        <div className="stat-content-modern">
                            <h3 className="stat-value-modern">{stats.totalServices}</h3>
                            <p className="stat-label-modern">Total Services</p>
                        </div>
                        <div className="stat-trend">
                            <EKGSignal size="medium" type="active" />
                        </div>
                    </div>

                    <div className="stat-card-modern stat-info-modern">
                        <div className="stat-icon-modern">
                            <Clock size={28} />
                        </div>
                        <div className="stat-content-modern">
                            <h3 className="stat-value-modern">{stats.activeExceptions}</h3>
                            <p className="stat-label-modern">Active Exceptions</p>
                        </div>
                        <div className="stat-trend">
                            <ThunderboltSignal size="small" type="active" />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons-modern">
                    <button
                        className={`action-btn-modern btn-sync ${isSyncing ? 'syncing' : ''}`}
                        onClick={handleSync}
                        disabled={isSyncing}
                    >
                        <RefreshCw size={20} className={isSyncing ? 'spinning' : ''} />
                        <span>{isSyncing ? 'Syncing...' : 'Sync Clusters'}</span>
                    </button>

                    <button
                        className="action-btn-modern btn-upload"
                        onClick={handleUploadClick}
                    >
                        <Upload size={20} />
                        <span>Upload Exceptions</span>
                        {uploadedFile && <span className="file-badge">{uploadedFile.name}</span>}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.csv,.json"
                        onChange={handleFileUpload}
                        className="hidden-file-input"
                    />
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-bar-modern">
                <Search size={20} className="search-icon-modern" />
                <input
                    type="text"
                    placeholder="Search clusters by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-modern"
                />
                {searchQuery && (
                    <span className="search-results-count">
                        {filteredClustersWithStatus.length} results
                    </span>
                )}
            </div>

            {/* Clusters Table */}
            <div className="clusters-table-modern">
                <div className="table-header-modern">
                    <h3 className="table-title">Cluster Schedule Management</h3>
                    <p className="table-subtitle">
                        Manage automated schedules and exceptions
                    </p>
                </div>

                <div className="table-container-modern">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th className="th-cluster">Cluster Name</th>
                                <th className="th-center">Active Services</th>
                                <th className="th-center">Running Services</th>
                                <th className="th-center">Closed Services</th>
                                <th className="th-center">Compute Type</th>
                                <th className="th-center">Schedule</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClustersWithStatus.map((cluster) => (
                                <tr
                                    key={cluster.id}
                                    className={`table-row-modern ${cluster.id % 2 !== 0 ? 'striped-row' : ''}`}
                                >
                                    <td
                                        className="cluster-name-modern clickable-cell"
                                        onClick={() => handleClusterClick(cluster.name)}
                                    >
                                        <div className="cluster-info">
                                            <Container size={20} className="cluster-icon-modern" />
                                            <div className="cluster-details">
                                                <span className="cluster-name-text">{cluster.name}</span>
                                                {cluster.scheduleStatus && (
                                                    <span className={`exception-badge ${cluster.scheduleStatus.badgeClass}`}>
                                                        <ExceptionTimer
                                                            remaining={cluster.scheduleStatus.remaining}
                                                            total={cluster.scheduleStatus.total}
                                                        />
                                                        Active {cluster.scheduleStatus.remaining} {cluster.scheduleStatus.remaining === 1 ? 'Day' : 'Days'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="td-center">
                                        <div className="service-count active-count">
                                            <EKGSignal size="small" type="active" />
                                            <span>{cluster.activeServices}</span>
                                        </div>
                                    </td>
                                    <td className="td-center">
                                        <div className="service-count running-count">
                                            <PlayCircle size={16} />
                                            <span>{cluster.runningServices}</span>
                                        </div>
                                    </td>
                                    <td className="td-center">
                                        <div className="service-count closed-count">
                                            <StopCircle size={16} />
                                            <span>{cluster.closedServices}</span>
                                        </div>
                                    </td>
                                    <td className="td-center">
                                        <span className={`compute-badge ${getComputeTypeColor(cluster.computeType)}`}>
                                            <Cpu size={14} />
                                            {cluster.computeType}
                                        </span>
                                    </td>
                                    <td className="td-center">
                                        <button
                                            className="schedule-btn"
                                            onClick={() => handleScheduleClick(cluster.id)}
                                        >
                                            <Calendar size={16} />
                                            <span>Set Schedule</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredClustersWithStatus.length === 0 && (
                        <div className="empty-state-modern">
                            <Container size={80} className="empty-icon-modern" />
                            <h3>No clusters found</h3>
                            <p>Try adjusting your search query</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Schedule Modal */}
            <ScheduleModal
                isOpen={isScheduleModalOpen}
                cluster={selectedCluster}
                initialRange={selectedCluster ? scheduledRanges[selectedCluster.name] : null}
                onClose={handleCloseModal}
                onConfirm={handleConfirmSchedule}
                onRemove={handleRemoveSchedule}
            />
        </div>
    );
}

export default ECS;