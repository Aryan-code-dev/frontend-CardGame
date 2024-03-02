import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UsernameInput = ({ onUsernameSubmit }) => { // Accept onUsernameSubmit prop
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onUsernameSubmit(username); // Call onUsernameSubmit with the entered username
        navigate('/card');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#333' }}>
            <h2 style={{ marginBottom: '20px', color: '#007bff' }}>Welcome to the Cards Game!</h2>
            <form onSubmit={handleSubmit} style={{ display: 'inline-block' }}>
                <label htmlFor="username" style={{ display: 'block', marginBottom: '10px', fontSize: '18px' }}>Enter your username:</label>
                <input 
                    type="text" 
                    id="username"
                    value={username} 
                    onChange={handleUsernameChange} 
                    placeholder="Enter your username" 
                    required
                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '10px', fontSize: '16px' }} 
                />
                <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>Submit</button>
            </form>
        </div>
    );
    
};

export default UsernameInput;
