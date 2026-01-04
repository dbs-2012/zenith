import { useState, useRef } from 'react';
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
    XCircle
} from 'lucide-react';
import '../../css/ecs/ECS.css';

function ECS() {
    const [searchQuery, setSearchQuery] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleClusterClick = (clusterName) => {
        navigate(`/ecs/${clusterName}`);
    };

    // Sample data - will be replaced with real data
    const clusters = [
        {
            id: 1,
            name: 'production-api-cluster',
            activeServices: 8,
            runningServices: 8,
            closedServices: 0,
            computeType: 'FARGATE',
            scheduledDays: 0,
            isException: false
        },
        {
            id: 2,
            name: 'production-web-cluster',
            activeServices: 12,
            runningServices: 10,
            closedServices: 2,
            computeType: 'ASG',
            scheduledDays: 7,
            isException: true
        },
        {
            id: 3,
            name: 'staging-cluster',
            activeServices: 5,
            runningServices: 5,
            closedServices: 0,
            computeType: 'FARGATE',
            scheduledDays: 0,
            isException: false
        },
        {
            id: 4,
            name: 'analytics-cluster',
            activeServices: 3,
            runningServices: 3,
            closedServices: 0,
            computeType: 'FARGATE',
            scheduledDays: 30,
            isException: true
        },
        {
            id: 5,
            name: 'development-cluster',
            activeServices: 4,
            runningServices: 2,
            closedServices: 2,
            computeType: 'ASG',
            scheduledDays: 0,
            isException: false
        }
    ];

    const totalServices = clusters.reduce((sum, c) => sum + c.activeServices, 0);

    const handleSync = () => {
        setIsSyncing(true);
        // Teammate will implement sync logic here
        setTimeout(() => {
            setIsSyncing(false);
        }, 2000);
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
        // Teammate will implement schedule modal/logic here
        console.log('Schedule clicked for cluster:', clusterId);
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
                <div className="header-content">
                    <div className="header-icon-modern">
                        <Container size={36} strokeWidth={2.5} />
                    </div>
                    <div className="header-text">
                        <h1 className="page-title-modern">ECS Cluster Scheduler</h1>
                        <p className="page-subtitle-modern">
                            Automated cluster management with nightly shutdown and exception handling
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats & Actions Bar */}
            <div className="stats-actions-container">
                {/* Stats Cards */}
                <div className="stats-cards-modern">
                    <div className="stat-card-modern stat-primary-modern">
                        <div className="stat-icon-modern">
                            <Container size={28} />
                        </div>
                        <div className="stat-content-modern">
                            <h3 className="stat-value-modern">{clusters.length}</h3>
                            <p className="stat-label-modern">Total Clusters</p>
                        </div>
                        <div className="stat-trend">
                            <TrendingUp size={16} />
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
                            <Activity size={16} />
                        </div>
                    </div>

                    <div className="stat-card-modern stat-info-modern">
                        <div className="stat-icon-modern">
                            <Clock size={28} />
                        </div>
                        <div className="stat-content-modern">
                            <h3 className="stat-value-modern">
                                {clusters.filter(c => c.isException).length}
                            </h3>
                            <p className="stat-label-modern">Active Exceptions</p>
                        </div>
                        <div className="stat-trend">
                            <Zap size={16} />
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
                        Manage automated shutdown schedules and exceptions
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
                            {filteredClusters.map((cluster) => (
                                <tr key={cluster.id} className={`table-row-modern ${cluster.isException ? 'exception-row' : ''}`}>
                                    <td className="cluster-name-modern clickable-cell" onClick={() => handleClusterClick(cluster.name)}>
                                        <div className="cluster-info">
                                            <Container size={20} className="cluster-icon-modern" />
                                            <div className="cluster-details">
                                                <span className="cluster-name-text">{cluster.name}</span>
                                                {cluster.isException && cluster.scheduledDays > 0 && (
                                                    <span className="exception-badge">
                                                        <Clock size={12} />
                                                        Active {cluster.scheduledDays} {cluster.scheduledDays === 1 ? 'Day' : 'Days'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="td-center">
                                        <div className="service-count active-count">
                                            <Activity size={16} />
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
        </div>
    );
}

export default ECS;
