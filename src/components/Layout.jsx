import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Server,
    Container,
    Boxes,
    HardDrive,
    Database,
    Menu,
    X,
    Sun,
    Moon,
    LogOut,
    User,
    Search,
    Bell,
    ChevronRight
} from 'lucide-react';
import '../css/Layout.css';
import '../css/body-theme.css';

function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    const navigate = useNavigate();
    const location = useLocation();

    // Apply theme to body element for proper overscroll background
    useEffect(() => {
        document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    }, [isDarkTheme]);

    useEffect(() => {
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    }, [isDarkTheme]);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/ec2', icon: Server, label: 'EC2 Instances' },
        { path: '/ecs', icon: Container, label: 'ECS Clusters' },
        { path: '/eks', icon: Boxes, label: 'EKS Clusters' },
        { path: '/ebs', icon: HardDrive, label: 'EBS Volumes' },
        { path: '/rds', icon: Database, label: 'RDS Databases' },
    ];

    // Get current page title
    const getCurrentPageTitle = () => {
        const currentItem = navItems.find(item =>
            item.end ? location.pathname === item.path : location.pathname.startsWith(item.path)
        );
        return currentItem?.label || 'Dashboard';
    };

    return (
        <div className="layout-container" data-theme={isDarkTheme ? 'dark' : 'light'}>
            {/* Modern Header */}
            <header className="modern-header">
                <div className="header-left">
                    <button
                        className="sidebar-toggle-btn"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
                    </button>

                    <Link to="/" className="brand-logo">
                        <div className="logo-icon">
                            <Server size={24} strokeWidth={2.5} />
                        </div>
                        <span className="brand-name">Zenith</span>
                    </Link>

                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <span className="breadcrumb-item">AWS</span>
                        <ChevronRight size={16} className="breadcrumb-separator" />
                        <span className="breadcrumb-item current">{getCurrentPageTitle()}</span>
                    </div>
                </div>

                <div className="header-right">
                    {/* Search Bar */}
                    <div className="search-container">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            className="search-input"
                        />
                    </div>

                    {/* Notifications */}
                    <button className="icon-btn notification-btn" aria-label="Notifications">
                        <Bell size={20} />
                        <span className="notification-badge">3</span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        className="icon-btn theme-btn"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* User Profile */}
                    <div className="user-profile">
                        <div className="user-avatar">
                            <User size={18} />
                        </div>
                        <div className="user-info">
                            <span className="user-name">Admin</span>
                            <span className="user-role">Administrator</span>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        className="icon-btn logout-btn"
                        onClick={handleLogout}
                        aria-label="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="layout-body">
                {/* Modern Sidebar */}
                <aside className={`modern-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    <nav className="sidebar-nav">
                        <div className="nav-section">
                            <div className="nav-section-title">
                                {!isSidebarCollapsed && <span>Resources</span>}
                            </div>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? 'active' : ''}`
                                        }
                                    >
                                        <div className="nav-link-content">
                                            <Icon size={20} className="nav-icon" strokeWidth={2} />
                                            {!isSidebarCollapsed && (
                                                <span className="nav-label">{item.label}</span>
                                            )}
                                        </div>
                                        {!isSidebarCollapsed && (
                                            <ChevronRight size={16} className="nav-arrow" />
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Sidebar Footer */}
                    {!isSidebarCollapsed && (
                        <div className="sidebar-footer">
                            <div className="sidebar-footer-card">
                                <div className="footer-card-icon">
                                    <Server size={20} />
                                </div>
                                <div className="footer-card-content">
                                    <h4>Need Help?</h4>
                                    <p>Check our documentation</p>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
