import '../css/ResourcePage.css';

function EC2() {
    return (
        <div className="resource-page">
            <div className="page-header">
                <div className="page-header-content">
                    <span className="page-icon">📦</span>
                    <div>
                        <h1 className="page-title">EC2 Instances</h1>
                        <p className="page-subtitle">Elastic Compute Cloud - Virtual Servers</p>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="placeholder-card">
                    <div className="placeholder-icon">📦</div>
                    <h2>EC2 Instances</h2>
                    <p>Manage your virtual servers in the cloud.</p>
                    <p className="placeholder-note">EC2 content will be added later.</p>
                </div>
            </div>
        </div>
    );
}

export default EC2;
