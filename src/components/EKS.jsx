import '../css/ResourcePage.css';

function EKS() {
    return (
        <div className="resource-page">
            <div className="page-header">
                <div className="page-header-content">
                    <span className="page-icon">☸️</span>
                    <div>
                        <h1 className="page-title">EKS Clusters</h1>
                        <p className="page-subtitle">Elastic Kubernetes Service</p>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="placeholder-card">
                    <div className="placeholder-icon">☸️</div>
                    <h2>EKS Clusters</h2>
                    <p>Manage your Kubernetes clusters.</p>
                    <p className="placeholder-note">EKS content will be added later.</p>
                </div>
            </div>
        </div>
    );
}

export default EKS;
