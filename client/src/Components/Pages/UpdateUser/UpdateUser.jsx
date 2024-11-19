import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UpdateUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState("");
    const [image, setImage] = useState(null); // Store Base64 image string here

    const loadData = async () => {
        const params = new URLSearchParams(window.location.search);

        const id = params.get('id');
        const token_key = params.get('login');
        const token = localStorage.getItem(token_key);

        try {
            const response = await axios.get(`http://localhost:3000/user/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('response', response);

            const userData = response.data.data;
            setName(userData.name);
            setEmail(userData.email);
            setPhone(userData.phone);
            setAge(userData.age);

        } catch (error) {
            console.log('error', error);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Set the Base64 string to image state
            };
            reader.readAsDataURL(file); // Read file as Base64 string
        }
    };

    const updateData = async (event) => {
        event.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const token_key = params.get('login');
        const token = localStorage.getItem(token_key);

        // Prepare JSON data including the Base64 image
        const data = {
            name,
            email,
            phone,
            age,
            image // Base64 string
        };

        try {
            const response = await axios.put(`http://localhost:3000/user/${id}`, data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('update response', response);

        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div>
            <div className="main-box">
                <div className="slider-cont">
                    <div>
                        <div>
                            <div style={{ padding: "90px 200px 0px 0px" }}>
                                <img src="./images/login_cover.webp" alt="Login Cover" style={{ width: 555 }} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-cont">
                    <div className="form form-signup">
                        <form onSubmit={updateData}>
                            <label>FULL NAME</label>
                            <input
                                type="text"
                                placeholder="Your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <label>E-MAIL</label>
                            <input
                                type="email"
                                placeholder="Your e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label>Phone No</label>
                            <input
                                type="text"
                                placeholder="Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />

                            <label>Image</label>
                            <input
                                type="file"
                                placeholder="file"
                                onChange={handleImageChange}
                            />

                            <label>Age</label>
                            <input
                                type="number"
                                placeholder="Age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />

                            <br /><br />

                            <div>
                                <button type="submit" className="custom-btn btn-13">Update</button>
                            </div>

                            <br /><br />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
