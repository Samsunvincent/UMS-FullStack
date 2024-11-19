import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function AdminComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState(null);
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);

    const addPage = () => {
        const token_key = new URLSearchParams(window.location.search).get('login');
        navigate(`/AddUser?login=${token_key}`);
    };

    const toggleOffCanvas = () => {
        setIsOffCanvasOpen(!isOffCanvasOpen);
    };

    const signout = () => {
        const token_key = new URLSearchParams(window.location.search).get('login');
        localStorage.removeItem(token_key);
        navigate('/');
    };

    const getToken = () => {
        const token_key = new URLSearchParams(window.location.search).get('login');
        return localStorage.getItem(token_key);
    };

    const getAllUsers = async () => {
        const token = getToken();
        setLoading(true);

        try {
            const response = await axios.get(`http://localhost:3000/getAllData`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Fetched users:', response.data);
            setUsers(response.data.data || []);
        } catch (error) {
            setError('Failed to fetch users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewClick = (id) => {
        const token_key = new URLSearchParams(window.location.search).get('login');
        navigate(`/ViewUser?login=${token_key}&id=${id}`);
    };

    const handleUpdateClick = (id) => {
        const token_key = new URLSearchParams(window.location.search).get('login');
        navigate(`/UpdateUser?login=${token_key}&id=${id}`);
    };

    const handleDeleteClick = async (id) => {
        const token = getToken();

        try {
            const response = await axios.delete(`http://localhost:3000/user/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                getAllUsers(); // Refresh user list after deletion
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting user', error);
        }
    };

    // Convert adminData into useEffect
    useEffect(() => {
        const adminData = async () => {
            const token = getToken();
            const id = new URLSearchParams(window.location.search).get('login');

            try {
                const response = await axios.get(`http://localhost:3000/user/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    validateStatus: (status) => status >= 200 && status < 300 || status === 401,
                });
                setAdmin(response.data.data);
            } catch (error) {
                console.error("Error fetching admin data", error);
            }
        };

        adminData(); // Call adminData on mount and when location changes
    }, [location]); // Depend on location to re-fetch admin data on navigation

    useEffect(() => {
        getAllUsers(); // Fetch all users on mount
    }, []);

    return (
        <div>
            <nav className="p-5 bg-dark">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="text-danger fs-3">Admin view</div>
                        <div className="d-flex align-items-center gap-5">
                            <a href="./index.html">Home</a>
                            <button onClick={addPage} className="adduser text-light">Add User</button>
                            <header>
                                <div className="user-icon text-light" onClick={toggleOffCanvas}>
                                    <img src="https://img.icons8.com/?size=100&id=492ILERveW8G&format=png&color=000000" alt="User Icon" style={{ width: 30 }} />
                                </div>
                                {isOffCanvasOpen && (
                                    <div className="off-canvas active">
                                        <div className="off-canvas-content">
                                            <div id="AdminProfileContainer" />
                                            <span className="d-flex justify-content-center">Admin</span>
                                            <div className='pt-5 text-center'>Name: {admin?.name}</div>
                                            <div className='text-center'>Email: {admin?.email}</div>
                                            <span onClick={toggleOffCanvas} className="position-absolute top-0 end-0">
                                                <i className="fa fa-close" style={{ fontSize: 26, color: "red", backgroundColor: "rgb(255, 255, 255)", padding: 20 }} />
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </header>
                            <button onClick={signout} className="adduser text-light">Sign Out</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="user pt-5">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="text-danger">{error}</div>
                ) : (
                    <table className="bg-white">
                        <thead>
                            <tr className="table-head">
                                <th>User</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Age</th>
                                <th>View</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users
                                    .filter(user => user._id !== '672c76de5e0c73ad44a7501f') // Omit admin if necessary
                                    .map(user => (
                                        <tr key={user._id}>
                                            <td><img src={`http://localhost:3000/${user.image}`} alt="user" style={{ width: 50, height: 50, borderRadius: '50%' }} /></td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.age}</td>
                                            <td><i className="fa fa-eye" style={{ fontSize: 24 }} onClick={() => handleViewClick(user._id)}></i></td>
                                            <td><i className="fa fa-edit" style={{ fontSize: 24 }} onClick={() => handleUpdateClick(user._id)}></i></td>
                                            <td><i className="fa fa-trash text-danger" style={{ fontSize: 24 }} onClick={() => handleDeleteClick(user._id)}></i></td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="8">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
