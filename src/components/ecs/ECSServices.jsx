import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Search,
    Play,
    Square,
    Calendar,
    Edit2,
    CheckCircle2,
    XCircle,
    Server,
    Save,
    X,
    Activity,
    Zap,
    AlertCircle,
    Minus,
    Plus,
    ArrowRight,
    Container
} from 'lucide-react';
import EKGSignal from '../common/EKGSignal';
import ScheduleModal from './ScheduleModal';
import ExceptionTimer from './ExceptionTimer';
import '../../css/ecs/ECSServices.css';

function ECSServices() {
    const { clusterName } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [editForm, setEditForm] = useState({ min: 0, desired: 0, max: 0 });
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [scheduledRange, setScheduledRange] = useState(null);

    // Initial load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('lombard_ecs_schedules');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed[clusterName]) {
                    setScheduledRange({
                        from: new Date(parsed[clusterName].from),
                        to: new Date(parsed[clusterName].to)
                    });
                }
            } catch (e) {
                console.error("Failed to load schedule", e);
            }
        }
    }, [clusterName]);

    // Calculate metadata for schedule badge
    const scheduleData = scheduledRange ? ((() => {
        const start = new Date(scheduledRange.from);
        start.setHours(0, 0, 0, 0);
        const end = new Date(scheduledRange.to);
        end.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const total = Math.round((end - start) / 86400000);
        const remaining = Math.max(0, Math.round((end - Math.max(today, start)) / 86400000));
        return { remainingDays: remaining, totalDays: total };
    })()) : null;

    // Mock data - Teammate will replace with API call
    const [services, setServices] = useState([
        { id: 1, name: 'auth-service', min: 2, desired: 2, max: 4, status: 'running', isActive: true },
        { id: 2, name: 'user-profile-service', min: 1, desired: 1, max: 2, status: 'running', isActive: true },
        { id: 3, name: 'payment-gateway', min: 2, desired: 2, max: 5, status: 'stopped', isActive: false },
        { id: 4, name: 'notification-worker', min: 1, desired: 1, max: 3, status: 'running', isActive: true },
        { id: 5, name: 'analytics-collector', min: 1, desired: 1, max: 2, status: 'stopped', isActive: false },
    ]);

    const handleBack = () => {
        navigate('/ecs');
    };

    // Filter services based on search query
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Placeholder for teammate: Logic to start all services
    const handleStartAll = () => {
        console.log('Start all services triggered');
        // TODO: Implement start all logic
    };

    // Placeholder for teammate: Logic to stop all services
    const handleStopAll = () => {
        console.log('Stop all services triggered');
        // TODO: Implement stop all logic
    };

    const handleRemoveSchedule = (name) => {
        setScheduledRange(null);

        // Get fresh copy from localStorage
        const saved = localStorage.getItem('lombard_ecs_schedules');
        if (saved) {
            try {
                const schedules = JSON.parse(saved);
                delete schedules[name];
                localStorage.setItem('lombard_ecs_schedules', JSON.stringify(schedules));
            } catch (e) {
                console.error("Failed to update localStorage", e);
            }
        }
        setIsScheduleModalOpen(false);
    };

    const handleSchedule = () => {
        setIsScheduleModalOpen(true);
    };

    const handleConfirmSchedule = (range) => {
        setScheduledRange(range);

        // Persist to localStorage for sync with main page
        const saved = localStorage.getItem('lombard_ecs_schedules');
        let schedules = {};
        if (saved) {
            try {
                schedules = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse current schedules", e);
            }
        }

        const start = new Date(range.from);
        start.setHours(0, 0, 0, 0);
        const end = new Date(range.to);
        end.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const total = Math.round((end - start) / 86400000);
        const remaining = Math.max(0, Math.round((end - Math.max(today, start)) / 86400000));

        schedules[clusterName] = {
            from: start.toISOString(),
            to: end.toISOString(),
            remainingDays: remaining,
            totalDays: total
        };

        localStorage.setItem('lombard_ecs_schedules', JSON.stringify(schedules));

        console.log(`Schedule confirmed for ${clusterName}:`, { duration: total });
        setIsScheduleModalOpen(false);
    };

    // Placeholder for teammate: Logic to toggle individual service
    const handleToggleService = (id) => {
        setServices(services.map(service => {
            if (service.id === id) {
                const newActiveState = !service.isActive;
                return {
                    ...service,
                    isActive: newActiveState,
                    status: newActiveState ? 'running' : 'stopped'
                };
            }
            return service;
        }));
        // TODO: Implement API call for toggle
    };

    const handleEditClick = (service) => {
        setSelectedService(service);
        setEditForm({
            min: service.min,
            desired: service.desired,
            max: service.max
        });
        setIsEditModalOpen(true);
    };

    const isFormValid = editForm.desired >= editForm.min && editForm.desired <= editForm.max;

    const handleEditSave = () => {
        if (selectedService && isFormValid) {
            setServices(services.map(service =>
                service.id === selectedService.id
                    ? { ...service, ...editForm }
                    : service
            ));
            setIsEditModalOpen(false);
            // TODO: Implement API call for update
        }
    };

    return (
        <div className="ecs-services-container">
            {/* Page Header */}
            <div className="page-header-modern">
                <div className="header-content">
                    <div className="header-left-section">
                        <div className="header-icon-modern">
                            <Container size={36} strokeWidth={2.5} />
                        </div>
                        <div className="header-text-column">
                            <button onClick={handleBack} className="tiny-back-btn">
                                <ChevronLeft size={14} />
                                <span>Back to Clusters</span>
                            </button>
                            <div className="title-row-modern">
                                <h1 className="page-title-modern">{clusterName}</h1>
                                {scheduleData && (
                                    <span className={`exception-badge ${(() => {
                                        if (scheduleData.remainingDays <= 1) return 'bg-critical';
                                        if ((scheduleData.remainingDays / scheduleData.totalDays) <= 0.5) return 'bg-warning';
                                        return 'bg-safe';
                                    })()}`}>
                                        <ExceptionTimer
                                            remaining={scheduleData.remainingDays}
                                            total={scheduleData.totalDays}
                                        />
                                        Active {scheduleData.remainingDays} {scheduleData.remainingDays === 1 ? 'Day' : 'Days'}
                                    </span>
                                )}
                            </div>
                            <p className="page-subtitle-modern">
                                Service Control
                            </p>
                        </div>
                    </div>
                    <button className="action-btn-modern btn-schedule-action" onClick={handleSchedule}>
                        <Calendar size={20} />
                        <span>Schedule</span>
                    </button>
                </div>
            </div>

            {/* Stats & Actions Bar */}
            <div className="stats-actions-container">
                {/* Stats Cards */}
                <div className="stats-cards-modern">
                    {/* Card 1: Running Services (Mapped from Total Clusters) */}
                    <div className="stat-card-modern stat-success-modern">
                        <div className="stat-icon-modern">
                            <Zap size={28} />
                        </div>
                        <div className="stat-content-modern">
                            <h3 className="stat-value-modern text-success">{services.filter(s => s.status === 'running').length}</h3>
                            <p className="stat-label-modern">Running Services</p>
                        </div>
                        <div className="stat-trend">
                            <EKGSignal size="small" type="active" />
                        </div>
                    </div>

                    {/* Card 2: Stopped Services (Mapped from Total Services) */}
                    <div className="stat-card-modern stat-stopped-modern">
                        <div className="stat-icon-modern">
                            <AlertCircle size={28} />
                        </div>
                        <div className="stat-content-modern">
                            <h3 className="stat-value-modern text-danger">{services.filter(s => s.status === 'stopped').length}</h3>
                            <p className="stat-label-modern">Stopped Services</p>
                        </div>
                        <div className="stat-trend">
                            <Minus size={16} />
                        </div>
                    </div>

                    {/* Card 3: Total Services (To fill 3rd slot) */}
                    <div className="stat-card-modern stat-info-modern">
                        <div className="stat-icon-modern">
                            <Server size={28} />
                        </div>
                        <div className="stat-content-modern">
                            <h3 className="stat-value-modern">{services.length}</h3>
                            <p className="stat-label-modern">Total Services</p>
                        </div>
                        <div className="stat-trend">
                            <Activity size={16} />
                        </div>
                    </div>
                </div>

                {/* Action Buttons (Vertical Column) */}
                <div className="action-buttons-modern">
                    <button className="action-btn-modern btn-start" onClick={handleStartAll}>
                        <Play size={20} fill="currentColor" />
                        <span>Start All</span>
                    </button>
                    <button className="action-btn-modern btn-stop" onClick={handleStopAll}>
                        <Square size={20} fill="currentColor" />
                        <span>Stop All</span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-bar-modern">
                <Search size={20} className="search-icon-modern" />
                <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-modern"
                />
                <span className="search-results-count">
                    {filteredServices.length} results
                </span>
            </div>

            {/* Services Table */}
            <div className="services-table-container">
                <table className="services-table">
                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Min</th>
                            <th>Desired</th>
                            <th>Max</th>
                            <th>Status</th>
                            <th>Toggle</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServices.map((service, index) => (
                            <tr key={service.id} className={`service-row ${index % 2 !== 0 ? 'striped-row' : ''}`}>
                                <td className="service-name-cell">
                                    <div className="service-name-content">
                                        <Server size={24} className="service-icon" />
                                        <span className="service-name-text">{service.name}</span>
                                    </div>
                                </td>
                                <td><span className="task-count">{service.min}</span></td>
                                <td><span className="task-count active">{service.desired}</span></td>
                                <td><span className="task-count">{service.max}</span></td>
                                <td>
                                    <div className={`status-badge ${service.status}`}>
                                        {service.status === 'running' ? (
                                            <>
                                                <CheckCircle2 size={14} />
                                                Running
                                            </>
                                        ) : (
                                            <>
                                                <XCircle size={14} />
                                                Stopped
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={service.isActive}
                                            onChange={() => handleToggleService(service.id)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEditClick(service)}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-minimal-content">
                        <div className="modal-minimal-header">
                            <span className="modal-sublabel">Configuration</span>
                            <h2 className="service-minimal-title">{selectedService?.name}</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="close-minimal-btn">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-stepper-body">
                            {/* Minimum */}
                            <div className="stepper-row highlight-row">
                                <div className="stepper-label-group">
                                    <span className="step-label">Minimum</span>
                                    <span className="step-desc">Lowest scaling limit</span>
                                </div>
                                <div className="stepper-control">
                                    <button
                                        className="step-btn"
                                        onClick={() => setEditForm(prev => ({ ...prev, min: Math.max(0, prev.min - 1) }))}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <input
                                        type="number"
                                        className="step-input"
                                        value={editForm.min}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                                    />
                                    <button
                                        className="step-btn"
                                        onClick={() => setEditForm(prev => ({ ...prev, min: prev.min + 1 }))}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Desired */}
                            <div className="stepper-row highlight-row">
                                <div className="stepper-label-group">
                                    <span className="step-label">Desired</span>
                                    <span className="step-desc">Target task count</span>
                                </div>
                                <div className="stepper-control">
                                    <button
                                        className="step-btn"
                                        onClick={() => setEditForm(prev => ({ ...prev, desired: Math.max(0, prev.desired - 1) }))}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <input
                                        type="number"
                                        className="step-input"
                                        value={editForm.desired}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, desired: parseInt(e.target.value) || 0 }))}
                                    />
                                    <button
                                        className="step-btn"
                                        onClick={() => setEditForm(prev => ({ ...prev, desired: prev.desired + 1 }))}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Maximum */}
                            <div className="stepper-row highlight-row">
                                <div className="stepper-label-group">
                                    <span className="step-label">Maximum</span>
                                    <span className="step-desc">Highest scaling limit</span>
                                </div>
                                <div className="stepper-control">
                                    <button
                                        className="step-btn"
                                        onClick={() => setEditForm(prev => ({ ...prev, max: Math.max(0, prev.max - 1) }))}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <input
                                        type="number"
                                        className="step-input"
                                        value={editForm.max}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                                    />
                                    <button
                                        className="step-btn"
                                        onClick={() => setEditForm(prev => ({ ...prev, max: prev.max + 1 }))}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            {!isFormValid && (
                                <div className="stepper-error-message">
                                    <AlertCircle size={16} />
                                    <span>Desired count must be between Minimum and Maximum.</span>
                                </div>
                            )}
                        </div>

                        <div className="modal-minimal-footer">
                            <button
                                onClick={handleEditSave}
                                className={`btn-save-minimal ${!isFormValid ? 'disabled' : ''}`}
                                disabled={!isFormValid}
                            >
                                <span>Save Changes</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Schedule Modal */}
            <ScheduleModal
                isOpen={isScheduleModalOpen}
                cluster={{ name: clusterName }}
                initialRange={scheduledRange}
                onClose={() => setIsScheduleModalOpen(false)}
                onConfirm={handleConfirmSchedule}
                onRemove={handleRemoveSchedule}
            />
        </div>
    );
}

export default ECSServices;
