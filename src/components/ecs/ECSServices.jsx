import { useState, useEffect, useMemo, useCallback } from 'react';
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
    X,
    Activity,
    Zap,
    AlertCircle,
    Minus,
    Plus,
    ArrowRight,
    Container,
    RefreshCw
} from 'lucide-react';
import EKGSignal from '../common/EKGSignal';
import ScheduleModal from './ScheduleModal';
import ExceptionTimer from './ExceptionTimer';
import '../../css/ecs/ECSServices.css';

// ============================================================================
// CONSTANTS
// ============================================================================
const SCHEDULE_CACHE_KEY = 'lombard_ecs_schedules';

// ============================================================================
// STATIC DATA - ORGANIZED BY CLUSTER (Remove when API is integrated)
// ============================================================================
const MOCK_SERVICES_BY_CLUSTER = {
    'production-api-cluster': [
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/auth-service',
            service_name: 'auth-service',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-api-cluster',
            cluster_name: 'production-api-cluster',
            min_value: 2,
            desired_value: 2,
            max_value: 4,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/user-profile-service',
            service_name: 'user-profile-service',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-api-cluster',
            cluster_name: 'production-api-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 2,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/payment-gateway',
            service_name: 'payment-gateway',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-api-cluster',
            cluster_name: 'production-api-cluster',
            min_value: 2,
            desired_value: 2,
            max_value: 5,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/notification-worker',
            service_name: 'notification-worker',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-api-cluster',
            cluster_name: 'production-api-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 3,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/analytics-collector',
            service_name: 'analytics-collector',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-api-cluster',
            cluster_name: 'production-api-cluster',
            min_value: 1,
            desired_value: 0,
            max_value: 2,
            current_status: 'stopped'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/cache-service',
            service_name: 'cache-service',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-api-cluster',
            cluster_name: 'production-api-cluster',
            min_value: 2,
            desired_value: 2,
            max_value: 4,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/email-service',
            service_name: 'email-service',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-api-cluster',
            cluster_name: 'production-api-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 3,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-api-cluster/sms-gateway',
            service_name: 'sms-gateway',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-api-cluster',
            cluster_name: 'production-api-cluster',
            min_value: 1,
            desired_value: 0,
            max_value: 2,
            current_status: 'stopped'
        },
    ],
    'production-web-cluster': [
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/frontend-app',
            service_name: 'frontend-app',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-web-cluster',
            cluster_name: 'production-web-cluster',
            min_value: 3,
            desired_value: 3,
            max_value: 6,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/cdn-service',
            service_name: 'cdn-service',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-web-cluster',
            cluster_name: 'production-web-cluster',
            min_value: 2,
            desired_value: 2,
            max_value: 4,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/static-assets',
            service_name: 'static-assets',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-web-cluster',
            cluster_name: 'production-web-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 2,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/web-worker',
            service_name: 'web-worker',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-web-cluster',
            cluster_name: 'production-web-cluster',
            min_value: 2,
            desired_value: 2,
            max_value: 5,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/websocket-server',
            service_name: 'websocket-server',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-web-cluster',
            cluster_name: 'production-web-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 3,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/api-gateway',
            service_name: 'api-gateway',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-web-cluster',
            cluster_name: 'production-web-cluster',
            min_value: 2,
            desired_value: 2,
            max_value: 4,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/load-balancer',
            service_name: 'load-balancer',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-web-cluster',
            cluster_name: 'production-web-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 2,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/reverse-proxy',
            service_name: 'reverse-proxy',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-web-cluster',
            cluster_name: 'production-web-cluster',
            min_value: 1,
            desired_value: 0,
            max_value: 2,
            current_status: 'stopped'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/ssl-terminator',
            service_name: 'ssl-terminator',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-web-cluster',
            cluster_name: 'production-web-cluster',
            min_value: 1,
            desired_value: 0,
            max_value: 2,
            current_status: 'stopped'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/production-web-cluster/session-manager',
            service_name: 'session-manager',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/production-web-cluster',
            cluster_name: 'production-web-cluster',
            min_value: 2,
            desired_value: 2,
            max_value: 4,
            current_status: 'running'
        },
    ],
    'staging-cluster': [
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/staging-cluster/test-api',
            service_name: 'test-api',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/staging-cluster',
            cluster_name: 'staging-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 2,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/staging-cluster/test-worker',
            service_name: 'test-worker',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/staging-cluster',
            cluster_name: 'staging-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 2,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/staging-cluster/test-db-connector',
            service_name: 'test-db-connector',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/staging-cluster',
            cluster_name: 'staging-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 2,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/staging-cluster/mock-service',
            service_name: 'mock-service',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/staging-cluster',
            cluster_name: 'staging-cluster',
            min_value: 1,
            desired_value: 0,
            max_value: 2,
            current_status: 'stopped'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/staging-cluster/integration-test',
            service_name: 'integration-test',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/staging-cluster',
            cluster_name: 'staging-cluster',
            min_value: 1,
            desired_value: 0,
            max_value: 2,
            current_status: 'stopped'
        },
    ],
    'analytics-cluster': [
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/analytics-cluster/data-collector',
            service_name: 'data-collector',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/analytics-cluster',
            cluster_name: 'analytics-cluster',
            min_value: 2,
            desired_value: 2,
            max_value: 4,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/analytics-cluster/data-processor',
            service_name: 'data-processor',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/analytics-cluster',
            cluster_name: 'analytics-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 3,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/analytics-cluster/metrics-aggregator',
            service_name: 'metrics-aggregator',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/analytics-cluster',
            cluster_name: 'analytics-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 2,
            current_status: 'running'
        },
    ],
    'development-cluster': [
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/development-cluster/dev-api',
            service_name: 'dev-api',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/development-cluster',
            cluster_name: 'development-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 2,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/development-cluster/dev-worker',
            service_name: 'dev-worker',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/development-cluster',
            cluster_name: 'development-cluster',
            min_value: 1,
            desired_value: 1,
            max_value: 2,
            current_status: 'running'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/development-cluster/debug-service',
            service_name: 'debug-service',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/development-cluster',
            cluster_name: 'development-cluster',
            min_value: 1,
            desired_value: 0,
            max_value: 2,
            current_status: 'stopped'
        },
        {
            service_arn: 'arn:aws:ecs:us-east-1:123456789:service/development-cluster/hot-reload',
            service_name: 'hot-reload',
            cluster_arn: 'arn:aws:ecs:us-east-1:123456789:cluster/development-cluster',
            cluster_name: 'development-cluster',
            min_value: 1,
            desired_value: 0,
            max_value: 2,
            current_status: 'stopped'
        },
    ]
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

// Calculate schedule metadata
const calculateScheduleData = (scheduledRange) => {
    if (!scheduledRange) return null;

    const start = new Date(scheduledRange.from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(scheduledRange.to);
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

    return { remainingDays: remaining, totalDays: total, badgeClass };
};

// Validate edit form - ONLY CHECK min <= max
const validateEditForm = (form) => {
    return form.min <= form.max;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function ECSServices() {
    const { clusterName } = useParams();
    const navigate = useNavigate();

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [editForm, setEditForm] = useState({ min: 0, desired: 0, max: 0 });
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [scheduledRange, setScheduledRange] = useState(null);
    const [services, setServices] = useState([]);
    const [clusterArn, setClusterArn] = useState(''); // Derived from first service
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isStartingAll, setIsStartingAll] = useState(false);
    const [isStoppingAll, setIsStoppingAll] = useState(false);
    const [operationResult, setOperationResult] = useState(null);

    // Debounced search query (300ms delay)
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // ========================================================================
    // API CALLS - FETCH SERVICES FOR SPECIFIC CLUSTER
    // ========================================================================

    const fetchServicesForCluster = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        // ⏸️ TODO: Replace with actual API call
        // Uncomment when API is ready:
        /*
        try {
            // Modified endpoint - uses clusterName instead of clusterArn
            const response = await fetch(`/api/ecs/clusters/${clusterName}/services`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch services: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            // Expected API response format (from your backend):
            // {
            //     success: true,
            //     data: [
            //         { 
            //             service_arn: "arn:aws:ecs:...",
            //             service_name: "auth-service",
            //             cluster_arn: "arn:aws:ecs:...",
            //             cluster_name: "production-api-cluster",
            //             min_value: 2, 
            //             desired_value: 2, 
            //             max_value: 4, 
            //             current_status: "running"
            //         },
            //         ...
            //     ]
            // }
            
            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to fetch services');
            }
            
            const servicesData = result.data || [];
            
            // Extract clusterArn from first service (all services have same cluster_arn)
            if (servicesData.length > 0) {
                setClusterArn(servicesData[0].cluster_arn);
            }
            
            // Map backend response to frontend format
            const mappedServices = servicesData.map(service => ({
                serviceArn: service.service_arn,
                name: service.service_name,
                clusterArn: service.cluster_arn,
                clusterName: service.cluster_name,
                min: service.min_value,
                desired: service.desired_value,
                max: service.max_value,
                status: service.current_status,
                isActive: service.desired_value > 0
            }));
            
            setServices(mappedServices);
        } catch (err) {
            console.error('Error fetching services:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
        */

        // 🎭 SIMULATION - Load cluster-specific mock data
        setTimeout(() => {
            const mockServices = MOCK_SERVICES_BY_CLUSTER[clusterName] || [];

            if (mockServices.length > 0) {
                setClusterArn(mockServices[0].cluster_arn);
            }

            // Map mock data to frontend format
            const mappedServices = mockServices.map(service => ({
                serviceArn: service.service_arn,
                name: service.service_name,
                clusterArn: service.cluster_arn,
                clusterName: service.cluster_name,
                min: service.min_value,
                desired: service.desired_value,
                max: service.max_value,
                status: service.current_status,
                isActive: service.desired_value > 0
            }));

            setServices(mappedServices);
            setIsLoading(false);
            console.log(`Loaded ${mappedServices.length} services for cluster: ${clusterName}`);
        }, 500);
    }, [clusterName]);

    // ========================================================================
    // EFFECTS
    // ========================================================================

    // Load services when cluster changes
    useEffect(() => {
        fetchServicesForCluster();
    }, [fetchServicesForCluster]);

    // Load schedule from localStorage on mount
    useEffect(() => {
        const loadSchedule = () => {
            const saved = localStorage.getItem(SCHEDULE_CACHE_KEY);
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
        };

        loadSchedule();
    }, [clusterName]);

    // Clear operation result after 5 seconds
    useEffect(() => {
        if (operationResult) {
            const timer = setTimeout(() => {
                setOperationResult(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [operationResult]);

    // ========================================================================
    // MEMOIZED CALCULATIONS
    // ========================================================================

    // Pre-calculate schedule data (memoized)
    const scheduleData = useMemo(() => {
        return calculateScheduleData(scheduledRange);
    }, [scheduledRange]);

    // Filtered services (memoized)
    const filteredServices = useMemo(() => {
        return services.filter(service =>
            service.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
    }, [services, debouncedSearchQuery]);

    // Calculate stats (memoized)
    const stats = useMemo(() => ({
        running: services.filter(s => s.status === 'running').length,
        stopped: services.filter(s => s.status === 'stopped').length,
        total: services.length
    }), [services]);

    // Validate form (memoized)
    const isFormValid = useMemo(() => {
        return validateEditForm(editForm);
    }, [editForm]);

    // ========================================================================
    // EVENT HANDLERS (All memoized with useCallback)
    // ========================================================================

    const handleBack = useCallback(() => {
        navigate('/ecs');
    }, [navigate]);

    // START ALL SERVICES
    const handleStartAll = useCallback(async () => {
        if (!clusterArn) return;

        setIsStartingAll(true);
        setError(null);
        setOperationResult(null);

        // ⏸️ TODO: Replace with actual API call
        // Uncomment when API is ready:
        /*
        try {
            const response = await fetch(`/api/ecs/start-cluster?clusterArn=${encodeURIComponent(clusterArn)}`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error('Failed to start services');
            }
            
            const result = await response.json();
            
            // Expected response:
            // {
            //     success: true,
            //     message: "Start operation completed",
            //     summary: {
            //         services_to_start: 5,
            //         services_started: 4,
            //         services_failed: 1,
            //         failed_services: [{ service_name: "...", error: "..." }]
            //     }
            // }
            
            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to start services');
            }
            
            setOperationResult({
                type: 'start',
                ...result.summary
            });
            
            // Refresh services list
            await fetchServicesForCluster();
            
        } catch (err) {
            console.error('Error starting services:', err);
            setError(err.message);
        } finally {
            setIsStartingAll(false);
        }
        */

        // 🎭 SIMULATION
        setTimeout(() => {
            const updatedServices = services.map(s => ({
                ...s,
                desired: s.min,
                status: 'running',
                isActive: true
            }));
            setServices(updatedServices);
            setOperationResult({
                type: 'start',
                services_to_start: services.length,
                services_started: services.length,
                services_failed: 0
            });
            setIsStartingAll(false);
            console.log('Started all services in cluster:', clusterName);
        }, 1500);
    }, [clusterArn, clusterName, services, fetchServicesForCluster]);

    // STOP ALL SERVICES
    const handleStopAll = useCallback(async () => {
        if (!clusterArn) return;

        setIsStoppingAll(true);
        setError(null);
        setOperationResult(null);

        // ⏸️ TODO: Replace with actual API call
        // Uncomment when API is ready:
        /*
        try {
            const response = await fetch(`/api/ecs/stop-cluster?clusterArn=${encodeURIComponent(clusterArn)}`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error('Failed to stop services');
            }
            
            const result = await response.json();
            
            // Expected response:
            // {
            //     success: true,
            //     message: "Stop operation completed",
            //     summary: {
            //         services_to_stop: 5,
            //         services_stopped: 5,
            //         services_failed: 0,
            //         failed_services: []
            //     }
            // }
            
            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to stop services');
            }
            
            setOperationResult({
                type: 'stop',
                ...result.summary
            });
            
            // Refresh services list
            await fetchServicesForCluster();
            
        } catch (err) {
            console.error('Error stopping services:', err);
            setError(err.message);
        } finally {
            setIsStoppingAll(false);
        }
        */

        // 🎭 SIMULATION
        setTimeout(() => {
            const updatedServices = services.map(s => ({
                ...s,
                desired: 0,
                status: 'stopped',
                isActive: false
            }));
            setServices(updatedServices);
            setOperationResult({
                type: 'stop',
                services_to_stop: services.length,
                services_stopped: services.length,
                services_failed: 0
            });
            setIsStoppingAll(false);
            console.log('Stopped all services in cluster:', clusterName);
        }, 1500);
    }, [clusterArn, clusterName, services, fetchServicesForCluster]);

    const handleSchedule = useCallback(() => {
        setIsScheduleModalOpen(true);
    }, []);

    const handleCloseScheduleModal = useCallback(() => {
        setIsScheduleModalOpen(false);
    }, []);

    const handleRemoveSchedule = useCallback((name) => {
        setScheduledRange(null);

        const saved = localStorage.getItem(SCHEDULE_CACHE_KEY);
        if (saved) {
            try {
                const schedules = JSON.parse(saved);
                delete schedules[name];
                localStorage.setItem(SCHEDULE_CACHE_KEY, JSON.stringify(schedules));
            } catch (e) {
                console.error("Failed to update localStorage", e);
            }
        }
        setIsScheduleModalOpen(false);
    }, []);

    const handleConfirmSchedule = useCallback((range) => {
        setScheduledRange(range);

        const saved = localStorage.getItem(SCHEDULE_CACHE_KEY);
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

        localStorage.setItem(SCHEDULE_CACHE_KEY, JSON.stringify(schedules));
        console.log(`Schedule confirmed for ${clusterName}:`, { duration: total });
        setIsScheduleModalOpen(false);
    }, [clusterName]);

    // TOGGLE SERVICE - START/STOP INDIVIDUAL SERVICE
    const handleToggleService = useCallback(async (service) => {
        const newActiveState = !service.isActive;
        const newDesiredValue = newActiveState ? service.min : 0;

        // ⏸️ TODO: Replace with actual API call
        // Uncomment when API is ready:
        /*
        try {
            const response = await fetch(`/api/ecs/update-service-counts?serviceArn=${encodeURIComponent(service.serviceArn)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    min_value: service.min,
                    desired_value: newDesiredValue,  // 0 to stop, min to start
                    max_value: service.max
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to toggle service');
            }
            
            const result = await response.json();
            
            // Expected response:
            // {
            //     success: true,
            //     message: "Service task counts updated successfully",
            //     data: {
            //         service_arn: "...",
            //         min_value: 2,
            //         desired_value: 0 or 2,
            //         max_value: 4,
            //         current_status: "stopped" or "running"
            //     }
            // }
            
            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to toggle service');
            }
            
            // Update local state
            setServices(services.map(s => 
                s.serviceArn === service.serviceArn 
                    ? { 
                        ...s, 
                        desired: result.data.desired_value,
                        status: result.data.current_status,
                        isActive: result.data.desired_value > 0
                    }
                    : s
            ));
            
        } catch (err) {
            console.error('Error toggling service:', err);
            setError(err.message);
        }
        */

        // 🎭 SIMULATION
        setServices(services.map(s => {
            if (s.serviceArn === service.serviceArn) {
                return {
                    ...s,
                    desired: newDesiredValue,
                    isActive: newActiveState,
                    status: newActiveState ? 'running' : 'stopped'
                };
            }
            return s;
        }));
        console.log(`Toggled service ${service.name} to ${newActiveState ? 'running' : 'stopped'}`);
    }, [services]);

    const handleEditClick = useCallback((service) => {
        setSelectedService(service);
        setEditForm({
            min: service.min,
            desired: service.desired,
            max: service.max
        });
        setIsEditModalOpen(true);
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setIsEditModalOpen(false);
    }, []);

    // UPDATE SERVICE COUNTS (min, desired, max)
    const handleEditSave = useCallback(async () => {
        if (!selectedService || !isFormValid) return;

        // ⏸️ TODO: Replace with actual API call
        // Uncomment when API is ready:
        /*
        try {
            const response = await fetch(`/api/ecs/update-service-counts?serviceArn=${encodeURIComponent(selectedService.serviceArn)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    min_value: editForm.min,
                    desired_value: editForm.desired,
                    max_value: editForm.max
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update service');
            }
            
            const result = await response.json();
            
            // Expected response:
            // {
            //     success: true,
            //     message: "Service task counts updated successfully",
            //     data: {
            //         service_arn: "...",
            //         min_value: 2,
            //         desired_value: 2,
            //         max_value: 4,
            //         current_status: "running"
            //     }
            // }
            
            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to update service');
            }
            
            // Update local state
            setServices(services.map(service =>
                service.serviceArn === selectedService.serviceArn
                    ? { 
                        ...service, 
                        min: result.data.min_value,
                        desired: result.data.desired_value,
                        max: result.data.max_value,
                        status: result.data.current_status,
                        isActive: result.data.desired_value > 0
                    }
                    : service
            ));
            setIsEditModalOpen(false);
            
        } catch (err) {
            console.error('Error updating service:', err);
            setError(err.message);
        }
        */

        // 🎭 SIMULATION
        setServices(services.map(service =>
            service.serviceArn === selectedService.serviceArn
                ? {
                    ...service,
                    ...editForm,
                    status: editForm.desired > 0 ? 'running' : 'stopped',
                    isActive: editForm.desired > 0
                }
                : service
        ));
        setIsEditModalOpen(false);
    }, [selectedService, isFormValid, editForm, services]);

    // Form update handlers (memoized)
    const handleMinChange = useCallback((value) => {
        setEditForm(prev => ({ ...prev, min: Math.max(0, value) }));
    }, []);

    const handleDesiredChange = useCallback((value) => {
        setEditForm(prev => ({ ...prev, desired: Math.max(0, value) }));
    }, []);

    const handleMaxChange = useCallback((value) => {
        setEditForm(prev => ({ ...prev, max: Math.max(0, value) }));
    }, []);

    const handleMinIncrement = useCallback(() => {
        setEditForm(prev => ({ ...prev, min: prev.min + 1 }));
    }, []);

    const handleMinDecrement = useCallback(() => {
        setEditForm(prev => ({ ...prev, min: Math.max(0, prev.min - 1) }));
    }, []);

    const handleDesiredIncrement = useCallback(() => {
        setEditForm(prev => ({ ...prev, desired: prev.desired + 1 }));
    }, []);

    const handleDesiredDecrement = useCallback(() => {
        setEditForm(prev => ({ ...prev, desired: Math.max(0, prev.desired - 1) }));
    }, []);

    const handleMaxIncrement = useCallback(() => {
        setEditForm(prev => ({ ...prev, max: prev.max + 1 }));
    }, []);

    const handleMaxDecrement = useCallback(() => {
        setEditForm(prev => ({ ...prev, max: Math.max(0, prev.max - 1) }));
    }, []);

    // ========================================================================
    // RENDER - LOADING & ERROR STATES
    // ========================================================================

    if (isLoading) {
        return (
            <div className="ecs-services-container">
                <div className="loading-state">
                    <RefreshCw size={48} className="spinning" />
                    <p>Loading services for {clusterName}...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ecs-services-container">
                <div className="error-state">
                    <AlertCircle size={48} className="error-icon" />
                    <h2>Failed to Load Services</h2>
                    <p>{error}</p>
                    <button onClick={fetchServicesForCluster} className="retry-btn">
                        <RefreshCw size={20} />
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

    if (services.length === 0) {
        return (
            <div className="ecs-services-container">
                <div className="empty-state">
                    <Server size={80} className="empty-icon" />
                    <h2>No Services Found</h2>
                    <p>Cluster "{clusterName}" has no services configured.</p>
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
        <div className="ecs-services-container">
            {/* Operation Result Banner */}
            {operationResult && (
                <div className={`operation-result-banner ${operationResult.type}`}>
                    <div className="operation-result-content">
                        <CheckCircle2 size={20} />
                        <div className="operation-result-text">
                            <strong>
                                {operationResult.type === 'start' ? 'Start' : 'Stop'} Operation Completed
                            </strong>
                            <span>
                                {operationResult.type === 'start'
                                    ? `${operationResult.services_started} of ${operationResult.services_to_start} services started`
                                    : `${operationResult.services_stopped} of ${operationResult.services_to_stop} services stopped`
                                }
                                {operationResult.services_failed > 0 && ` • ${operationResult.services_failed} failed`}
                            </span>
                        </div>
                        <button onClick={() => setOperationResult(null)} className="close-banner-btn">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

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
                                    <span className={`exception-badge ${scheduleData.badgeClass}`}>
                                        <ExceptionTimer
                                            remaining={scheduleData.remainingDays}
                                            total={scheduleData.totalDays}
                                        />
                                        Active {scheduleData.remainingDays} {scheduleData.remainingDays === 1 ? 'Day' : 'Days'}
                                    </span>
                                )}
                            </div>
                            <p className="page-subtitle-modern">
                                Service Control • {services.length} {services.length === 1 ? 'Service' : 'Services'}
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
                    <div className="stat-card-modern stat-success-modern">
                        <div className="stat-icon-modern">
                            <Zap size={28} />
                        </div>
                        <div className="stat-content-modern">
                            <h3 className="stat-value-modern text-success">{stats.running}</h3>
                            <p className="stat-label-modern">Running Services</p>
                        </div>
                        <div className="stat-trend">
                            <EKGSignal size="small" type="active" />
                        </div>
                    </div>

                    <div className="stat-card-modern stat-stopped-modern">
                        <div className="stat-icon-modern">
                            <AlertCircle size={28} />
                        </div>
                        <div className="stat-content-modern">
                            <h3 className="stat-value-modern text-danger">{stats.stopped}</h3>
                            <p className="stat-label-modern">Stopped Services</p>
                        </div>
                        <div className="stat-trend">
                            <Minus size={16} />
                        </div>
                    </div>

                    <div className="stat-card-modern stat-info-modern">
                        <div className="stat-icon-modern">
                            <Server size={28} />
                        </div>
                        <div className="stat-content-modern">
                            <h3 className="stat-value-modern">{stats.total}</h3>
                            <p className="stat-label-modern">Total Services</p>
                        </div>
                        <div className="stat-trend">
                            <Activity size={16} />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons-modern">
                    <button
                        className="action-btn-modern btn-start"
                        onClick={handleStartAll}
                        disabled={isStartingAll || isStoppingAll}
                    >
                        {isStartingAll ? (
                            <RefreshCw size={20} className="spinning" />
                        ) : (
                            <Play size={20} fill="currentColor" />
                        )}
                        <span>{isStartingAll ? 'Starting...' : 'Start All'}</span>
                    </button>
                    <button
                        className="action-btn-modern btn-stop"
                        onClick={handleStopAll}
                        disabled={isStartingAll || isStoppingAll}
                    >
                        {isStoppingAll ? (
                            <RefreshCw size={20} className="spinning" />
                        ) : (
                            <Square size={20} fill="currentColor" />
                        )}
                        <span>{isStoppingAll ? 'Stopping...' : 'Stop All'}</span>
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
                            <tr key={service.serviceArn} className={`service-row ${index % 2 !== 0 ? 'striped-row' : ''}`}>
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
                                            onChange={() => handleToggleService(service)}
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
                            <button onClick={handleCloseEditModal} className="close-minimal-btn">
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
                                    <button className="step-btn" onClick={handleMinDecrement}>
                                        <Minus size={18} />
                                    </button>
                                    <input
                                        type="number"
                                        className="step-input"
                                        value={editForm.min}
                                        onChange={(e) => handleMinChange(parseInt(e.target.value) || 0)}
                                    />
                                    <button className="step-btn" onClick={handleMinIncrement}>
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
                                    <button className="step-btn" onClick={handleDesiredDecrement}>
                                        <Minus size={18} />
                                    </button>
                                    <input
                                        type="number"
                                        className="step-input"
                                        value={editForm.desired}
                                        onChange={(e) => handleDesiredChange(parseInt(e.target.value) || 0)}
                                    />
                                    <button className="step-btn" onClick={handleDesiredIncrement}>
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
                                    <button className="step-btn" onClick={handleMaxDecrement}>
                                        <Minus size={18} />
                                    </button>
                                    <input
                                        type="number"
                                        className="step-input"
                                        value={editForm.max}
                                        onChange={(e) => handleMaxChange(parseInt(e.target.value) || 0)}
                                    />
                                    <button className="step-btn" onClick={handleMaxIncrement}>
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Show error ONLY if min > max */}
                            {!isFormValid && (
                                <div className="stepper-error-message">
                                    <AlertCircle size={16} />
                                    <span>Minimum must be less than or equal to Maximum.</span>
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
                onClose={handleCloseScheduleModal}
                onConfirm={handleConfirmSchedule}
                onRemove={handleRemoveSchedule}
            />
        </div>
    );
}

export default ECSServices;