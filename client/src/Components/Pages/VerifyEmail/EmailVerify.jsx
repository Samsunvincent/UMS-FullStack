import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default function EmailVerify() {
  const [email, setEmail] = useState("");

  const sendEmail = async(event) => {
    event.preventDefault();


    try {
        let response = await axios.post('http://localhost:3000/forgot-password',{email},{
            headers : {
                'Content-Type'  : 'application/json',

            },
        });
        console.log("response",response)

        if(response.status === 200){
            alert(response.data.message)
        }
        else{
            alert('User not found')
        }

    } catch (error) {
        console.log("error",error);
    }

    // Handle email submission here
    console.log("Sending reset link to:", email);
  };

  return (
    <>
      <div className="container container1 position-absolute top-50 start-50 translate-middle">
        <div className="logo">
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google Logo" /> */}
        </div>
        <div className="verification-box">
          <h1>Email Verification</h1>
          <p className="info-text">To continue, please verify your email.</p>

          <form onSubmit={sendEmail}>
            <input
              type="email"
              className="email-input"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="verify-button">Send reset link</button>
          </form>

          <p className="support-text">Not your email? <a href="#">Use another account</a></p>
        </div>
      </div>
    </>
  );
}
