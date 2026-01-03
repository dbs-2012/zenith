import { useNavigate } from 'react-router-dom';
import '../../css/home/Home.css';

function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">Welcome to Zenith Dashboard</h1>
                <p className="home-subtitle">You are successfully logged in!</p>

                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Home;
