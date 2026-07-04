// import React from 'react'
// import { NavLink } from 'react-router-dom'
// import { toast } from 'react-toastify'
// import '../styles/bottom-nav.css'

// const BottomNav = () => {

//   // Check current session states
//   const activePartner = localStorage.getItem('activePartner');
//   const activeUser = localStorage.getItem('activeUser');

//   const isPartnerLoggedIn = activePartner && activePartner !== "null" && activePartner !== "undefined" && activePartner.trim() !== "";
//   const isUserLoggedIn = activeUser && activeUser !== "null" && activeUser !== "undefined" && activeUser.trim() !== "";

//   // Dynamically set the profile link based on the logged-in role
//   let profileLink = "/register"; // Default fallback
//   if (isPartnerLoggedIn) profileLink = "/food-partner/me";
//   else if (isUserLoggedIn) profileLink = "/user/me";

//   const handleUploadClick = (e) => {
//     if (!isPartnerLoggedIn) {
//       e.preventDefault();
//       toast.error("⚠️ Access Denied. Only authorized Food Partners can upload culinary reels.");
//     }
//   };

//   const handleProfileClick = (e) => {
//     if (!isPartnerLoggedIn && !isUserLoggedIn) {
//       e.preventDefault();
//       toast.error("⚠️ Authentication Required. Please log in or register to view your profile.", {
//         onClose: () => { window.location.href = '/register'; }
//       });
//     }
//   };

//   return (
//     <nav className="bottom-nav" role="navigation" aria-label="Bottom">
//       <div className="bottom-nav__inner">
        
//         <NavLink to="/" end className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
//           <span className="bottom-nav__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/></svg></span>
//           <span className="bottom-nav__label">Home</span>
//         </NavLink>

//         <NavLink to="/search" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
//           <span className="bottom-nav__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
//           <span className="bottom-nav__label">Search</span>
//         </NavLink>

//         <NavLink 
//           to="/create-food" 
//           onClick={handleUploadClick}
//           className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
//         >
//           <span className="bottom-nav__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" height="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></span>
//           <span className="bottom-nav__label">Upload</span>
//         </NavLink>

//         <NavLink to="/saved" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
//           <span className="bottom-nav__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg></span>
//           <span className="bottom-nav__label">Saved</span>
//         </NavLink>

//         <NavLink 
//           to={profileLink} 
//           onClick={handleProfileClick}
//           className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
//         >
//           <span className="bottom-nav__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
//           <span className="bottom-nav__label">Profile</span>
//         </NavLink>

//       </div>
//     </nav>
//   )
// }

// export default BottomNav;











import React from 'react'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../styles/bottom-nav.css'

const BottomNav = () => {

  // Check current session states
  const activePartner = localStorage.getItem('activePartner');
  const activeUser = localStorage.getItem('activeUser');

  const isPartnerLoggedIn = activePartner && activePartner !== "null" && activePartner !== "undefined" && activePartner.trim() !== "";
  const isUserLoggedIn = activeUser && activeUser !== "null" && activeUser !== "undefined" && activeUser.trim() !== "";
  const isLoggedIn = isPartnerLoggedIn || isUserLoggedIn;

  // Dynamically set the profile link based on the logged-in role
  let profileLink = "/register"; // Default fallback
  if (isPartnerLoggedIn) profileLink = "/food-partner/me";
  else if (isUserLoggedIn) profileLink = "/user/me";

  const handleUploadClick = (e) => {
    if (!isPartnerLoggedIn) {
      e.preventDefault();
      toast.error("⚠️ Access Denied. Only authorized Food Partners can upload culinary reels.");
    }
  };

  // Functional Logout Logic
  const handleLogout = () => {
    localStorage.removeItem('activePartner');
    localStorage.removeItem('activeUser');
    toast.success("Logged out successfully!");
    // Hard redirect clears React state cleanly and routes to login
    window.location.href = '/register'; 
  };

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Bottom">
      <div className="bottom-nav__inner" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        
        <NavLink to="/" end className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/></svg></span>
          <span className="bottom-nav__label">Home</span>
        </NavLink>

        <NavLink to="/search" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          <span className="bottom-nav__label">Search</span>
        </NavLink>

        <NavLink 
          to="/create-food" 
          onClick={handleUploadClick}
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
        >
          <span className="bottom-nav__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" height="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></span>
          <span className="bottom-nav__label">Upload</span>
        </NavLink>

        <NavLink to="/saved" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg></span>
          <span className="bottom-nav__label">Saved</span>
        </NavLink>

        {/* --- CONDITIONAL RENDERING --- */}
        {!isLoggedIn ? (
          /* 🔴 LOGGED OUT VIEW: Show Login Icon */
          <NavLink to="/register" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
            <span className="bottom-nav__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            </span>
            <span className="bottom-nav__label">Login</span>
          </NavLink>
        ) : (
          /* 🟢 LOGGED IN VIEW: Show Profile & Logout Icons */
          <>
            <NavLink to={profileLink} className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
              <span className="bottom-nav__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
              <span className="bottom-nav__label">Profile</span>
            </NavLink>

            <button 
              onClick={handleLogout} 
              className="bottom-nav__item" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <span className="bottom-nav__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </span>
              <span className="bottom-nav__label" style={{ color: '#ef4444' }}>Logout</span>
            </button>
          </>
        )}

      </div>
    </nav>
  )
}

export default BottomNav;