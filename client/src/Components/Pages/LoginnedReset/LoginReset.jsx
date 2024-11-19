import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginReset() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);  // Loading state
    const navigate = useNavigate();

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        let params = new URLSearchParams(window.location.search);
        let id = params.get('id');
        let token_key = params.get('login');
        let token = localStorage.getItem(token_key);

        if (!id || !token) {
            alert("Invalid request parameters.");
            return;
        }

        const data = { currentPassword, newPassword };

        try {
            setLoading(true);  // Start loading
            const response = await axios.put(
                `http://localhost:3000/passwordreset/${id}`, 
                data, 
                {  
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            
            alert(response.data.message);
            navigate('/'); // Redirect after successful reset
        } catch (error) {
            console.error("Error resetting password:", error);

            if (error.response && error.response.data) {
                alert(error.response.data.message || "An error occurred while resetting the password.");
            } else {
                alert("An unexpected error occurred.");
            }
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-title">
                Reset Password
            </div>
            <form onSubmit={handlePasswordReset}>
                <div className="form-section">
                    <label htmlFor="currentpassword" className="form-label">Current Password</label>
                    <input 
                        type="password" 
                        name="currentpassword" 
                        placeholder="Current Password" 
                        className="form-input" 
                        required 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                    />
                </div>
                <div className="form-section">
                    <label htmlFor="newpassword" className="form-label">New Password</label>
                    <input 
                        type="password"  
                        name="newpassword" 
                        placeholder="New Password" 
                        className="form-input" 
                        required 
                        onChange={(e) => setNewPassword(e.target.value)} 
                    />
                </div>
                <button 
                    type="submit" 
                    className="form-button" 
                    disabled={loading}
                >
                    {loading ? 'Resetting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}
