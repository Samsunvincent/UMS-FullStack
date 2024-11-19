import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
 

export default function ResetPassword() {

    const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const handleResetInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPassword) => ({
      ...prevPassword,
      [name]: value
    }));
    console.log("passwords", passwords);
  };

  const resetPassword = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    let params = new URLSearchParams(window.location.search);
    let token_key = params.get("login");
    let id = params.get('id');
    console.log("id", id);

    let token = localStorage.getItem(token_key);

    try {
        const response = await axios.put(`http://localhost:3000/passwordreset/${id}`, passwords, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log("response", response);

        if (response.status === 200) {
            alert(response.data.message);
            navigate('/');
        }
    } catch (error) {
        console.error("error", error);
        // Check if there is a response and display the error message if available
        if (error.response && error.response.data && error.response.data.message) {
            alert(error.response.data.message);
        } else {
            alert("An error occurred while resetting the password.");
        }
    }
};


  return (
    <div className="reset-password-wrapper">
  <div className="password-reset-container">
    <div className="password-reset-box">
      <h2 className="reset-title">Reset Password</h2>
      <form onSubmit={resetPassword}>
        <div className="password-input-group">
          <label htmlFor="current-password" className="input-label">Current Password</label>
          <input
            type="password"
            id="current-password"
            name="currentPassword"
            className="password-input"
            value={passwords.currentPassword}
            onChange={handleResetInputChange}
            required
          />
        </div>
        <div className="password-input-group">
          <label htmlFor="new-password" className="input-label">New Password</label>
          <input
            type="password"
            id="new-password"
            name="newPassword"
            className="password-input"
            value={passwords.newPassword}
            onChange={handleResetInputChange}
            required
          />
        </div>
        <div className="password-submit-btn">
          <button type="submit" className="submit-btn">Reset Password</button>
        </div>
      </form>
    </div>
  </div>
</div>

  );
}
