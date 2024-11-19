import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewUser() {
    const [singleUser, setSingleUser] = useState(null); // State to store the user data
    const [loading, setLoading] = useState(true); // State to track loading
    const [error, setError] = useState(null); // State to track errors
    const navigate = useNavigate();

    // Function to fetch user data by ID
    const singleUserData = async () => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const token_key = params.get('login');
        const token = localStorage.getItem(token_key);

        if (!id || !token) {
            setError("User ID or token is missing.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3000/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                validateStatus: (status) => {
                    return status >= 200 && status < 300 || status === 401;
                },
            });
            console.log("response", response);

            const contentType = response.headers['content-type'];
            if (contentType && contentType.includes('text/html')) {
                setError('Unexpected HTML response, possibly due to an expired or invalid token.');
                return;
            }

            setSingleUser(response.data.data); // Store the fetched user data in state
            console.log('singleUser', singleUser);

            // console.log(singleUser.image);
        } catch (error) {
            setError('Failed to fetch user data');
            console.error('Error:', error);
        } finally {
            setLoading(false); // Stop loading once the request is done
        }
    };

    // Fetch user data on component mount
    useEffect(() => {
        singleUserData();
    }, []);

    // Redirect to login if unauthorized
    useEffect(() => {
        if (error && error.includes('Unauthorized')) {
            navigate('/');
        }
    }, [error, navigate]);

    // Render loading, error, or the user profile information
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    return (
        <div className="View_container text-center">
            <div>
                {singleUser && (
                    <>
                        <div className="profile-header">
                            <img
                                src={`http://localhost:3000/${singleUser.image}`} 
                                alt="User Image"
                                className="profile-img"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                            />


                            <h2 className="profile-name">{singleUser.name || "John Doe"}</h2>
                            <p className="profile-role">{singleUser.role || "Web Developer"}</p>
                        </div>
                        <div className="profile-body">
                            <div className="profile-info">
                                <h3>Contact Information</h3>
                                <ul>
                                    <li><strong>Email:</strong> {singleUser.email || "john.doe@example.com"}</li>
                                    <li><strong>Phone:</strong> {singleUser.phone || "(123) 456-7890"}</li>
                                    <li><strong>Age:</strong> {singleUser.age || 30}</li>
                                </ul>
                            </div>
                            <div className="profile-bio">
                                <h3>Biography</h3>
                                <p>{singleUser.bio || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
