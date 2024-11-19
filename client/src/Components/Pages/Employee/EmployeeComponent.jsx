import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OffCanvas from '../ToggleOffcanvas/Offcanvas';
import "../ToggleOffcanvas/Offcanvas.css"


const ProfileComponent = () => {
    const [profile, setProfile] = useState(null); // Initialize profile state
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate(); // Initialize navigate

    const fetchProfile = async () => {
        setLoading(true); // Set loading state to true
        let params = new URLSearchParams(window.location.search);
        let id = params.get('id');
        let token_key = params.get('login');
        let token = localStorage.getItem(token_key);

        try {
            let response = await axios.get(`http://localhost:3000/user/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            console.log('Response Data:', response.data); // Log full response data

            // Set profile data using the nested field `response.data.data`
            setProfile(response.data.data);
        } catch (error) {
            console.log("Error fetching profile:", error);
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    const signout = () => {
        let params = new URLSearchParams(window.location.search);
        let token_key = params.get('login');
        localStorage.removeItem(token_key);
        navigate('/'); // Redirecting to login page
    };

    useEffect(() => {
        fetchProfile(); // Fetch profile data on component mount
    }, []);

    return (
        <>
            <div className='bg-dark'>
                <nav>
                    <div className="d-flex justify-content-between p-5 fs-6">
                        <div>
                            <p className="text-white">Employee view</p>
                        </div>
                        <div className="d-flex align-items-center gap-5 px-3 text-white">
                            <div>Home</div>
                            <div>About</div>
                            <div>Contact</div>
                            {/* Pass the complete profile object to the OffCanvas component */}
                            <div>
                                <OffCanvas 
                                    profile={profile} // Pass the entire profile object
                                    loading={loading} 
                                    fetchProfile={fetchProfile} 
                                />
                            </div>
                            <div>
                                <button onClick={signout}>Sign Out</button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div id="welcome-container">
                    <div className="text-white p-5 fs-3">
                        WELCOME {profile?.name || 'Guest'} {/* Display profile name or 'Guest' */}
                    </div>
                    <div className="text-white set-welcome px-5 fs-4">
                        We are thrilled to have you as part of our growing family! At ABC, we believe that our success stems from the collective contributions of each and every one of you. Your skills, passion, and dedication are key to driving us forward.
                        We are committed to fostering an environment where you can thrive, learn, and grow both personally and professionally. Here, we value collaboration, innovation, and a shared vision for excellence.
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileComponent;
