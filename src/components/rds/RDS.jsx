import '../../css/ResourcePage.css';

function RDS() {
    return (
        <div className="resource-page">
            <div className="page-header">
                <div className="page-header-content">
                    <span className="page-icon">🗄️</span>
                    <div>
                        <h1 className="page-title">RDS Databases</h1>
                        <p className="page-subtitle">Relational Database Service</p>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="placeholder-card">
                    <div className="placeholder-icon">🗄️</div>
                    <h2>RDS Databases</h2>
                    <p>Manage your relational databases.</p>
                    <p className="placeholder-note">RDS content will be added later.</p>
                </div>
            </div>
        </div>
    );
}

export default RDS;
