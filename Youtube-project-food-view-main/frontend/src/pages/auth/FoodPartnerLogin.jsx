

import React, { useState } from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(" https://food-app-backend-rnwb.onrender.com/api/auth/food-partner/login", {
        email,
        password
      }, { withCredentials: true });

      // 🔐 SAVE PARTNER SESSION & CLEAR CUSTOMER SESSION
      if (response.data && (response.data.foodPartner || response.data.partner)) {
        const partnerInfo = response.data.foodPartner || response.data.partner;
        localStorage.setItem('activePartner', JSON.stringify(partnerInfo));
        localStorage.removeItem('activeUser'); // Prevent role overlap
      } else if (response.data) {
        localStorage.setItem('activePartner', JSON.stringify(response.data));
        localStorage.removeItem('activeUser');
      }

      sessionStorage.setItem('justLoggedIn', 'true');

      setEmail('');
      setPassword('');

      toast.success("Welcome back, Chef!"); 
      navigate("/create-food"); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid email or password.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        <header>
          <h1 id="partner-login-title" className="auth-title">Partner login</h1>
          <p className="auth-subtitle">Access your dashboard and manage orders.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off" noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email" name="email" type="email" placeholder="business@example.com" 
              autoComplete="new-password" 
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" name="password" type="password" placeholder="Password" 
              autoComplete="new-password" 
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="auth-submit" type="submit">Sign In</button>
        </form>
        <div className="auth-alt-action">
          New partner? <a href="/food-partner/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
