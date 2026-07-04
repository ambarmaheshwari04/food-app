import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import '../../styles/create-food.css';
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ videoFile, setVideoFile ] = useState(null);
    const [ videoURL, setVideoURL ] = useState('');
    const [ fileError, setFileError ] = useState('');
    const [ isAuthorized, setIsAuthorized ] = useState(false);
    const [price, setPrice] = useState('');
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    // 🔒 Strict Evaluation Route Guard Layer
    useEffect(() => {
        const partnerSession = localStorage.getItem("activePartner");
        
        // Comprehensive check to catch empty, missing, or corrupted session data
        if (!partnerSession || partnerSession === 'undefined' || partnerSession === 'null') {
            alert("Access Denied. You must be logged in first to access the content creation wizard.");
            navigate("/");
        } else {
            setIsAuthorized(true);
        }
    }, [navigate]);

    useEffect(() => {
        if (!videoFile) {
            setVideoURL('');
            return;
        }
        const url = URL.createObjectURL(videoFile);
        setVideoURL(url);
        return () => URL.revokeObjectURL(url);
    }, [ videoFile ]);

    const onFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) { setVideoFile(null); setFileError(''); return; }
        if (!file.type.startsWith('video/')) { setFileError('Please select a valid video file.'); return; }
        setFileError('');
        setVideoFile(file);
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer?.files?.[0];
        if (!file) { return; }
        if (!file.type.startsWith('video/')) { setFileError('Please drop a valid video file.'); return; }
        setFileError('');
        setVideoFile(file);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const openFileDialog = () => fileInputRef.current?.click();

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append("mama", videoFile);
        formData.append('price', price);

        try {
            const response = await axios.post("http://localhost:3000/api/food", formData, {
                withCredentials: true,
            });
            console.log(response.data);
            navigate("/"); 
        } catch (error) {
            console.error("Error executing secure food upload:", error);
            alert("Upload failed. Please ensure you maintain a valid authentication session.");
        }
    };

    const isDisabled = useMemo(() => !name.trim() || !videoFile, [ name, videoFile ]);

    // Block render completely until the validation phase is successfully resolved
    if (!isAuthorized) {
        return null;
    }return (
        <div className="create-food-page" style={{ minHeight: '100vh', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px 20px 100px 20px', boxSizing: 'border-box', color: '#fff' }}>
            <div className="create-food-card" style={{ width: '100%', maxWidth: '520px', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '30px', boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)' }}>
                
                <header className="create-food-header" style={{ textAlign: 'center', marginBottom: '26px' }}>
                    <h1 className="create-food-title" style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 6px 0', letterSpacing: '0.5px', background: 'linear-gradient(45deg, #ff9f43, #ff5252)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Create Food</h1>
                    <p className="create-food-subtitle" style={{ fontSize: '13px', color: '#aaa', margin: 0 }}>Upload a short video, give it a name, and add a description.</p>
                </header>

                <form className="create-food-form" onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div className="field-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="foodVideo" style={{ fontSize: '13px', fontWeight: '600', color: '#ddd', letterSpacing: '0.5px' }}>FOOD VIDEO</label>
                        <input
                            id="foodVideo"
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={onFileChange}
                            style={{ display: 'none' }}
                        />

                        <div
                            className="file-dropzone"
                            role="button"
                            tabIndex={0}
                            onClick={openFileDialog}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFileDialog(); } }}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            style={{ width: '100%', background: 'rgba(255, 255, 255, 0.02)', border: '2px dashed rgba(255, 255, 255, 0.15)', borderRadius: '16px', padding: '30px 20px', boxSizing: 'border-box', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        >
                            <div className="file-dropzone-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <svg className="file-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: '#ff9f43' }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="file-dropzone-text" style={{ fontSize: '14px', color: '#eee' }}>
                                    <strong style={{ color: '#ff9f43' }}>Tap to upload</strong> or drag and drop
                                </div>
                                <div className="file-hint" style={{ fontSize: '11px', color: '#777' }}>MP4, WebM, MOV • Up to ~100MB</div>
                            </div>
                        </div>

                        {fileError && <p className="error-text" role="alert" style={{ color: '#ff5252', fontSize: '12px', margin: '4px 0 0 0', fontWeight: '500' }}>{fileError}</p>}

                        {videoFile && (
                            <div className="file-chip" aria-live="polite" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '10px 14px', marginTop: '4px', boxSizing: 'border-box' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff9f43" strokeWidth="2" style={{ flexShrink: 0 }}>
                                    <path d="M23 7a2 2 0 0 0-2.45-1.45L16 7V5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2l4.55 1.45A2 2 0 0 0 23 17V7z" />
                                </svg>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="file-chip-name" style={{ fontSize: '13px', color: '#eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{videoFile.name}</div>
                                    <div className="file-chip-size" style={{ fontSize: '11px', color: '#666' }}>{(videoFile.size / 1024 / 1024).toFixed(1)} MB</div>
                                </div>
                                <div className="file-chip-actions" style={{ display: 'flex', gap: '8px' }}>
                                    <button type="button" className="btn-ghost" onClick={openFileDialog} style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>Change</button>
                                    <button type="button" className="btn-ghost danger" onClick={() => { setVideoFile(null); setFileError(''); }} style={{ background: 'transparent', border: 'none', color: '#ff5252', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>Remove</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {videoURL && (
                        <div className="video-preview" style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', background: '#111', border: '1px solid rgba(255, 255, 255, 0.08)', maxHeight: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <video className="video-preview-el" src={videoURL} controls playsInline preload="metadata" style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain' }} />
                        </div>
                    )}

                    <div className="field-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="foodName" style={{ fontSize: '13px', fontWeight: '600', color: '#ddd', letterSpacing: '0.5px' }}>NAME</label>
                        <input
                            id="foodName"
                            type="text"
                            placeholder="e.g., Spicy Paneer Wrap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px 16px', background: '#121212', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
                        />
                    </div>
                    <input 
  type="number" 
  placeholder="Enter Price (₹)" 
  value={price} 
  onChange={(e) => setPrice(e.target.value)} 
  style={{ width: '100%', padding: '10px', marginBottom: '10px' }} // apni styling laga lena
  required
/>

                    <div className="field-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="foodDesc" style={{ fontSize: '13px', fontWeight: '600', color: '#ddd', letterSpacing: '0.5px' }}>DESCRIPTION</label>
                        <textarea
                            id="foodDesc"
                            rows={3}
                            placeholder="Write a short description: ingredients, taste, spice level, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', background: '#121212', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'none', transition: 'border 0.2s' }}
                        />
                    </div>

                    <div className="form-actions" style={{ marginTop: '6px' }}>
                        <button 
                            className="btn-primary" 
                            type="submit" 
                            disabled={isDisabled}
                            style={{ width: '100%', padding: '14px', background: isDisabled ? 'rgba(255, 255, 255, 0.05)' : 'linear-gradient(45deg, #ff9f43, #ff5252)', color: isDisabled ? '#555' : '#fff', border: 'none', borderRadius: '28px', fontSize: '15px', fontWeight: '600', cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', boxShadow: isDisabled ? 'none' : '0 8px 24px rgba(255, 82, 82, 0.25)' }}
                        >
                            Save Food
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;