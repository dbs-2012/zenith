import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../css/Layout.css';

function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    const navigate = useNavigate();

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
        { path: '/', icon: '🏠', label: 'Home' },
        { path: '/ec2', icon: '📦', label: 'EC2' },
        { path: '/ecs', icon: '🐳', label: 'ECS' },
        { path: '/eks', icon: '☸️', label: 'EKS' },
        { path: '/ebs', icon: '💾', label: 'EBS' },
        { path: '/rds', icon: '🗄️', label: 'RDS' },
    ];

    return (
        <div className="layout-container" data-theme={isDarkTheme ? 'dark' : 'light'}>
            {/* Header */}
            <header className="layout-header">
                <div className="header-left">
                    <button
                        className="sidebar-toggle"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <span className="hamburger-icon">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>
                    <Link to="/" className="header-title">Zenith Dashboard</Link>
                </div>
                <div className="header-right">
                    <button
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        <span>{isDarkTheme ? '☀️' : '🌙'}</span>
                    </button>
                    <div className="user-info">
                        <div className="user-avatar">
                            <span>👤</span>
                        </div>
                        <span className="user-name">Admin</span>
                    </div>
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        aria-label="Logout"
                        title="Logout"
                    >
                        <span>🚪</span>
                    </button>
                </div>
            </header>

            <div className="layout-body">
                {/* Sidebar */}
                <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    <nav className="sidebar-nav">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
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
