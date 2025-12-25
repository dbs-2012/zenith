import '../css/ResourcePage.css';

function ECS() {
    return (
        <div className="resource-page">
            <div className="page-header">
                <div className="page-header-content">
                    <span className="page-icon">🐳</span>
                    <div>
                        <h1 className="page-title">ECS Containers</h1>
                        <p className="page-subtitle">Elastic Container Service</p>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="placeholder-card">
                    <div className="placeholder-icon">🐳</div>
                    <h2>ECS Containers</h2>
                    <p>Manage your containerized applications.</p>
                    <p className="placeholder-note">ECS content will be added later.</p>
                </div>
            </div>
        </div>
    );
}

export default ECS;
