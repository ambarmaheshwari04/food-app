

import React, { useState } from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://food-app-backend-rnwb.onrender.com/api/auth/user/login", {
        email,
        password
      }, { withCredentials: true });

      // 🔐 SAVE CUSTOMER SESSION & CLEAR PARTNER SESSION
      if (response.data && response.data.user) {
        localStorage.setItem('activeUser', JSON.stringify(response.data.user));
        localStorage.removeItem('activePartner'); // Prevent role overlap
      }

      setEmail('');
      setPassword('');

      toast.success("Logged in successfully! Ready to order."); 
      navigate("/"); 

    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred during login.";
      toast.error(errorMessage); 
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="user-login-title">
        <header>
          <h1 id="user-login-title" className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your food journey.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off" noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email" name="email" type="email" placeholder="you@example.com" 
              autoComplete="new-password" 
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" name="password" type="password" placeholder="••••••••" 
              autoComplete="new-password" 
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="auth-submit" type="submit">Sign In</button>
        </form>
        <div className="auth-alt-action">
          New here? <a href="/user/register">Create account</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
