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
    ArrowRight
} from 'lucide-react';
import EKGSignal from '../common/EKGSignal';
import ScheduleModal from './ScheduleModal';
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

    // Placeholder for teammate: Logic to schedule cluster
    const handleSchedule = () => {
        setIsScheduleModalOpen(true);
    };

    const handleConfirmSchedule = (range) => {
        setScheduledRange(range);
        console.log(`Schedule confirmed for ${clusterName}:`, {
            from: range.from.toLocaleDateString(),
            to: range.to.toLocaleDateString()
        });
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
            {/* Top Navigation Bar */}
            <div className="ecs-page-header">
                <button onClick={handleBack} className="back-button">
                    <ChevronLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="services-search-wrapper">
                    <Search className="services-search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="services-search-input"
                    />
                    <div className="services-search-badge">{filteredServices.length}</div>
                </div>
            </div>

            {/* Hero Command Center */}
            <div className="ecs-hero-section">
                <div className="hero-content">
                    <h1 className="cluster-title">{clusterName}</h1>

                    <div className="hero-controls-bar">
                        <div className="cluster-stats">
                            <div className="stat-card running-card">
                                <div className="stat-icon-wrapper">
                                    <Zap size={24} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{services.filter(s => s.status === 'running').length}</span>
                                    <span className="stat-label">Running Services</span>
                                </div>
                            </div>
                            <div className="stat-card stopped-card">
                                <div className="stat-icon-wrapper">
                                    <AlertCircle size={24} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{services.filter(s => s.status === 'stopped').length}</span>
                                    <span className="stat-label">Stopped Services</span>
                                </div>
                            </div>
                        </div>

                        <div className="services-action-buttons">
                            <button className="btn-action btn-start" onClick={handleStartAll}>
                                <Play size={18} fill="currentColor" />
                                <span>Start All</span>
                            </button>
                            <button className="btn-action btn-stop" onClick={handleStopAll}>
                                <Square size={18} fill="currentColor" />
                                <span>Stop All</span>
                            </button>
                            <button className="btn-action btn-schedule" onClick={handleSchedule}>
                                <Calendar size={18} />
                                <span>Schedule</span>
                            </button>
                        </div>
                    </div>
                </div>
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
                        {filteredServices.map((service) => (
                            <tr key={service.id} className="service-row">
                                <td className="service-name-cell">
                                    <Server size={24} className="service-icon" />
                                    {service.name}
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
                onClose={() => setIsScheduleModalOpen(false)}
                onConfirm={handleConfirmSchedule}
            />
        </div>
    );
}

export default ECSServices;
