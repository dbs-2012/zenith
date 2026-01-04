import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Search,
    RefreshCw,
    Upload,
    Calendar,
    Server,
    Activity,
    PlayCircle,
    StopCircle,
    Cpu,
    Clock,
    FileUp,
    Zap,
    TrendingUp,
    CheckCircle2,
    XCircle,
    GitCompare
} from 'lucide-react';
import EKGSignal from '../common/EKGSignal';
import ThunderboltSignal from '../common/ThunderboltSignal';
import ECSIcon from '../common/ECSIcon';
import ExceptionTimer from './ExceptionTimer';
import '../../css/ecs/ECS.css';
import '../../css/ecs/ScheduleModal.css';
import { X, Minus, Plus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ScheduleModal from './ScheduleModal';

function ECS() {
    const [searchQuery, setSearchQuery] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [scheduledRanges, setScheduledRanges] = useState({}); // Stores ranges per cluster ID
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Load schedules from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('lombard_ecs_schedules');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Convert string dates back to Date objects
                const hydrated = {};
                Object.keys(parsed).forEach(key => {
                    hydrated[key] = {
                        ...parsed[key],
                        from: new Date(parsed[key].from),
                        to: new Date(parsed[key].to)
                    };
                });
                setScheduledRanges(hydrated);
            } catch (e) {
                console.error("Failed to parse schedules", e);
            }
        }
    }, []);

    const handleClusterClick = (clusterName) => {
        navigate(`/ecs/${clusterName}`);
    };

    const [clusters, setClusters] = useState([
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
    ]);

    const totalServices = clusters.reduce((sum, c) => sum + c.activeServices, 0);
    const totalClustersCount = clusters.length;

    // Simulation: Functional logic for data fetching
    const fetchClusters = async () => {
        // This will be replaced with: const response = await fetch('/api/ecs/clusters');
        // For now, we simulate the current state being "loaded"
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            console.log('Clusters fetched from API');
        }, 1000);
    };

    const handleSync = () => {
        fetchClusters();
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            // Teammate will implement file processing logic here
            console.log('File uploaded:', file.name);
        }
    };

    const handleScheduleClick = (clusterId) => {
        const cluster = clusters.find(c => c.id === clusterId);
        setSelectedCluster(cluster);
        setIsScheduleModalOpen(true);
    };

    const handleRemoveSchedule = (clusterName) => {
        const updatedRanges = { ...scheduledRanges };
        delete updatedRanges[clusterName];

        setScheduledRanges(updatedRanges);

        // Get fresh copy from localStorage to ensure we only remove the specific one
        const saved = localStorage.getItem('lombard_ecs_schedules');
        if (saved) {
            try {
                const schedules = JSON.parse(saved);
                delete schedules[clusterName];
                localStorage.setItem('lombard_ecs_schedules', JSON.stringify(schedules));
            } catch (e) {
                console.error("Failed to update localStorage", e);
            }
        }
        setIsScheduleModalOpen(false);
    };

    const handleConfirmSchedule = (range) => {
        if (selectedCluster) {
            const start = new Date(range.from);
            start.setHours(0, 0, 0, 0);
            const endNormal = new Date(range.to);
            endNormal.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const total = Math.round((endNormal - start) / 86400000);
            const remaining = Math.max(0, Math.round((endNormal - Math.max(today, start)) / 86400000));

            const newSchedule = {
                from: start.toISOString(),
                to: endNormal.toISOString(),
                remainingDays: remaining,
                totalDays: total
            };

            const updatedRanges = {
                ...scheduledRanges,
                [selectedCluster.name]: newSchedule
            };

            setScheduledRanges(prev => ({
                ...prev,
                [selectedCluster.name]: {
                    ...newSchedule,
                    from: start,
                    to: endNormal
                }
            }));

            localStorage.setItem('lombard_ecs_schedules', JSON.stringify(updatedRanges));
            setIsScheduleModalOpen(false);
        }
    };

    const filteredClusters = clusters.filter(cluster =>
        cluster.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    return (
        <div className="ecs-page">
            {/* Page Header */}
            <div className="page-header-modern">
                <div className="header-content-cluster">
                    <div className="header-left-cluster">
                        <div className="header-icon-modern">
                            <ECSIcon size={64} />
                        </div>
                        <div className="header-text">
                            <h1 className="page-title-modern">ECS Cluster Scheduler</h1>
                            {/* <p className="page-subtitle-modern">
                                Automated cluster management with nightly shutdown and exception handling
                            </p> */}
                        </div>
                    </div>

                    <button
                        className="btn-delta-updates"
                        onClick={() => navigate('/ecs/updates')}
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
                            <h3 className="stat-value-modern">{totalClustersCount}</h3>
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
                            <h3 className="stat-value-modern">{totalServices}</h3>
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
                            <h3 className="stat-value-modern">
                                {Object.keys(scheduledRanges).length}
                            </h3>
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
                        onClick={() => fileInputRef.current?.click()}
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
                        style={{ display: 'none' }}
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
                        {filteredClusters.length} results
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
                            {filteredClusters.map((cluster, index) => (
                                <tr key={cluster.id} className={`table-row-modern ${index % 2 !== 0 ? 'striped-row' : ''}`}>
                                    <td className="cluster-name-modern clickable-cell" onClick={() => handleClusterClick(cluster.name)}>
                                        <div className="cluster-info">
                                            <Container size={20} className="cluster-icon-modern" />
                                            <div className="cluster-details">
                                                <span className="cluster-name-text">{cluster.name}</span>
                                                {(cluster.isException || scheduledRanges[cluster.name]) && (
                                                    <span className={`exception-badge ${(() => {
                                                        const data = scheduledRanges[cluster.name];
                                                        if (!data) return 'bg-safe';

                                                        const start = new Date(data.from);
                                                        start.setHours(0, 0, 0, 0);
                                                        const end = new Date(data.to);
                                                        end.setHours(0, 0, 0, 0);
                                                        const today = new Date();
                                                        today.setHours(0, 0, 0, 0);

                                                        const total = Math.round((end - start) / 86400000);
                                                        const remaining = Math.max(0, Math.round((end - Math.max(today, start)) / 86400000));

                                                        if (remaining <= 1) return 'bg-critical';
                                                        if ((remaining / total) <= 0.5) return 'bg-warning';
                                                        return 'bg-safe';
                                                    })()}`}>
                                                        {(() => {
                                                            const data = scheduledRanges[cluster.name];
                                                            if (!data) return null;

                                                            const start = new Date(data.from);
                                                            start.setHours(0, 0, 0, 0);
                                                            const end = new Date(data.to);
                                                            end.setHours(0, 0, 0, 0);
                                                            const today = new Date();
                                                            today.setHours(0, 0, 0, 0);

                                                            const remaining = Math.max(0, Math.round((end - Math.max(today, start)) / 86400000));
                                                            const total = Math.round((end - start) / 86400000);

                                                            return (
                                                                <>
                                                                    <ExceptionTimer
                                                                        remaining={remaining}
                                                                        total={total}
                                                                    />
                                                                    Active {remaining} {remaining === 1 ? 'Day' : 'Days'}
                                                                </>
                                                            );
                                                        })()}
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

                    {filteredClusters.length === 0 && (
                        <div className="empty-state-modern">
                            <Container size={80} className="empty-icon-modern" />
                            <h3>No clusters found</h3>
                            <p>Try adjusting your search query</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Schedule Modal Component */}
            <ScheduleModal
                isOpen={isScheduleModalOpen}
                cluster={selectedCluster}
                initialRange={selectedCluster ? scheduledRanges[selectedCluster.name] : null}
                onClose={() => setIsScheduleModalOpen(false)}
                onConfirm={handleConfirmSchedule}
                onRemove={handleRemoveSchedule}
            />
        </div>
    );
}

export default ECS;
