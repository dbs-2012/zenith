import '../../css/ResourcePage.css';

function EBS() {
    return (
        <div className="resource-page">
            <div className="page-header">
                <div className="page-header-content">
                    <span className="page-icon">💾</span>
                    <div>
                        <h1 className="page-title">EBS Volumes</h1>
                        <p className="page-subtitle">Elastic Block Store - Block Storage</p>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="placeholder-card">
                    <div className="placeholder-icon">💾</div>
                    <h2>EBS Volumes</h2>
                    <p>Manage your block storage volumes.</p>
                    <p className="placeholder-note">EBS content will be added later.</p>
                </div>
            </div>
        </div>
    );
}

export default EBS;
