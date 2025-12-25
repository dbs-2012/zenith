import '../css/ResourcePage.css';

function Dashboard() {
    return (
        <div className="resource-page">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Combined overview of all AWS resources</p>
            </div>

            <div className="page-content">
                <div className="placeholder-card">
                    <div className="placeholder-icon">📊</div>
                    <h2>Welcome to Zenith Dashboard</h2>
                    <p>This is your central hub for monitoring all AWS resources.</p>
                    <p className="placeholder-note">Dashboard content will be customized later.</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
