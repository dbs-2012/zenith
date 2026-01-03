import {
    Server,
    Container,
    Boxes,
    HardDrive,
    Database,
    TrendingUp,
    Activity,
    DollarSign,
    Clock,
    ArrowRight,
    Zap,
    Shield,
    AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../css/home/Dashboard.css';

function Dashboard() {
    const resourceCards = [
        {
            id: 'ec2',
            title: 'EC2 Instances',
            icon: Server,
            count: 12,
            status: 'running',
            color: 'blue',
            link: '/ec2',
            description: 'Virtual servers in the cloud'
        },
        {
            id: 'ecs',
            title: 'ECS Clusters',
            icon: Container,
            count: 5,
            status: 'active',
            color: 'purple',
            link: '/ecs',
            description: 'Container orchestration service'
        },
        {
            id: 'eks',
            title: 'EKS Clusters',
            icon: Boxes,
            count: 3,
            status: 'healthy',
            color: 'cyan',
            link: '/eks',
            description: 'Managed Kubernetes service'
        },
        {
            id: 'ebs',
            title: 'EBS Volumes',
            icon: HardDrive,
            count: 24,
            status: 'available',
            color: 'green',
            link: '/ebs',
            description: 'Block storage volumes'
        },
        {
            id: 'rds',
            title: 'RDS Databases',
            icon: Database,
            count: 8,
            status: 'online',
            color: 'orange',
            link: '/rds',
            description: 'Managed relational databases'
        }
    ];

    const metrics = [
        {
            label: 'Total Resources',
            value: '52',
            change: '+12%',
            trend: 'up',
            icon: Activity,
            color: 'blue'
        },
        {
            label: 'Monthly Cost',
            value: '$2,847',
            change: '-8%',
            trend: 'down',
            icon: DollarSign,
            color: 'green'
        },
        {
            label: 'Active Services',
            value: '28',
            change: '+5%',
            trend: 'up',
            icon: Zap,
            color: 'purple'
        },
        {
            label: 'Health Score',
            value: '98%',
            change: '+2%',
            trend: 'up',
            icon: Shield,
            color: 'cyan'
        }
    ];

    const recentActivity = [
        { action: 'EC2 instance i-abc123 started', time: '2 minutes ago', type: 'success' },
        { action: 'ECS service deployed successfully', time: '15 minutes ago', type: 'success' },
        { action: 'RDS backup completed', time: '1 hour ago', type: 'info' },
        { action: 'EBS volume attached to i-xyz789', time: '2 hours ago', type: 'info' },
    ];

    return (
        <div className="dashboard-page">
            {/* Hero Section */}
            <div className="dashboard-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Welcome to <span className="gradient-text">Zenith</span>
                    </h1>
                    <p className="hero-subtitle">
                        Your centralized AWS automation dashboard. Manage all your cloud resources in one place.
                    </p>
                </div>
                <div className="hero-stats">
                    <div className="stat-badge">
                        <Activity size={16} />
                        <span>All Systems Operational</span>
                    </div>
                    <div className="stat-badge">
                        <Clock size={16} />
                        <span>Last updated: Just now</span>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div key={index} className={`metric-card metric-${metric.color}`}>
                            <div className="metric-header">
                                <div className="metric-icon">
                                    <Icon size={20} />
                                </div>
                                <span className={`metric-change ${metric.trend}`}>
                                    {metric.change}
                                </span>
                            </div>
                            <div className="metric-body">
                                <h3 className="metric-value">{metric.value}</h3>
                                <p className="metric-label">{metric.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Resource Cards */}
                <div className="resources-section">
                    <div className="section-header">
                        <h2 className="section-title">AWS Resources</h2>
                        <p className="section-subtitle">Quick access to all your cloud resources</p>
                    </div>

                    <div className="resource-cards-grid">
                        {resourceCards.map((resource) => {
                            const Icon = resource.icon;
                            return (
                                <Link
                                    key={resource.id}
                                    to={resource.link}
                                    className={`resource-card resource-${resource.color}`}
                                >
                                    <div className="resource-card-header">
                                        <div className="resource-icon">
                                            <Icon size={24} strokeWidth={2} />
                                        </div>
                                        <span className={`status-badge status-${resource.color}`}>
                                            {resource.status}
                                        </span>
                                    </div>
                                    <div className="resource-card-body">
                                        <h3 className="resource-title">{resource.title}</h3>
                                        <p className="resource-description">{resource.description}</p>
                                    </div>
                                    <div className="resource-card-footer">
                                        <div className="resource-count">
                                            <span className="count-value">{resource.count}</span>
                                            <span className="count-label">Active</span>
                                        </div>
                                        <div className="resource-action">
                                            <span>Manage</span>
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="activity-section">
                    <div className="section-header">
                        <h2 className="section-title">Recent Activity</h2>
                        <button className="view-all-btn">View All</button>
                    </div>

                    <div className="activity-feed">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className={`activity-item activity-${activity.type}`}>
                                <div className="activity-indicator"></div>
                                <div className="activity-content">
                                    <p className="activity-action">{activity.action}</p>
                                    <span className="activity-time">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h3 className="quick-actions-title">Quick Actions</h3>
                        <div className="action-buttons">
                            <button className="action-btn action-primary">
                                <Server size={18} />
                                <span>Launch Instance</span>
                            </button>
                            <button className="action-btn action-secondary">
                                <Container size={18} />
                                <span>Create Cluster</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
