import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Search,
    PlayCircle,
    StopCircle,
    Calendar,
    Edit2,
    CheckCircle2,
    XCircle,
    Server,
    Save,
    X,
    Activity
} from 'lucide-react';
import EKGSignal from '../common/EKGSignal';
import '../../css/ecs/ECSServices.css';

function ECSServices() {
    const { clusterName } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [editForm, setEditForm] = useState({ min: 0, desired: 0, max: 0 });

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
        console.log('Schedule cluster triggered');
        // TODO: Implement schedule logic
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
            {/* Header Section */}
            <div className="services-header">
                <div className="services-header-left">
                    <button onClick={handleBack} className="back-button">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="services-header-title">
                        <div className="services-breadcrumb">ECS Clusters / Services</div>
                        <h1>{clusterName}</h1>
                    </div>
                </div>

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

            {/* Controls Section */}
            <div className="services-controls">
                <div className="cluster-stats">
                    <div className="stat-item">
                        <EKGSignal className="stat-icon running" type="success" size="medium" />
                        <span>{services.filter(s => s.status === 'running').length} Running</span>
                    </div>
                    <div className="stat-item">
                        <StopCircle size={18} className="stat-icon stopped" />
                        <span>{services.filter(s => s.status === 'stopped').length} Stopped</span>
                    </div>
                </div>

                <div className="services-action-buttons">
                    <button className="btn-action btn-start" onClick={handleStartAll}>
                        <PlayCircle size={18} />
                        <span>Start All</span>
                    </button>
                    <button className="btn-action btn-stop" onClick={handleStopAll}>
                        <StopCircle size={18} />
                        <span>Stop All</span>
                    </button>
                    <button className="btn-action btn-schedule" onClick={handleSchedule}>
                        <Calendar size={18} />
                        <span>Schedule</span>
                    </button>
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
                                    <Server size={18} className="service-icon" />
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
            {
                isEditModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="modal-title-wrapper">
                                    <h2>Edit Service Tasks</h2>
                                    <p className="modal-subtitle">Adjust settings for <strong>{selectedService?.name}</strong></p>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="close-btn">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Minimum Tasks</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editForm.min}
                                        onChange={(e) => setEditForm({ ...editForm, min: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Desired Tasks</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editForm.desired}
                                        onChange={(e) => setEditForm({ ...editForm, desired: parseInt(e.target.value) || 0 })}
                                        className={!isFormValid ? 'input-error' : ''}
                                    />
                                    {!isFormValid && (
                                        <span className="error-text">Desired must be between Min and Max</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Maximum Tasks</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editForm.max}
                                        onChange={(e) => setEditForm({ ...editForm, max: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={handleEditSave}
                                    className={`btn-save ${!isFormValid ? 'disabled' : ''}`}
                                    disabled={!isFormValid}
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default ECSServices;
