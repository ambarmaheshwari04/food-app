import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReelFeed from '../../components/ReelFeed'; // Adjust the import path if needed

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/food', { withCredentials: true });
                
                // 💡 The exact same extraction logic that worked on your Search page!
                const foodsArray = Array.isArray(response.data) 
                    ? response.data 
                    : (response.data.foodItems || response.data.foods || []);
                
                // 🔄 Reverse the array so the newest uploads show up first on the feed!
                setVideos(foodsArray.reverse());
            } catch (error) {
                console.error("Error fetching home feed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <main className="home-page" style={{ minHeight: '100vh', background: '#000', paddingBottom: '80px' }}>
            {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#888' }}>
                    <div style={{ fontSize: '30px', animation: 'spin 1s linear infinite', marginBottom: '10px' }}>⏳</div>
                    <span style={{ fontWeight: '600' }}>Loading your feed...</span>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </div>
            ) : (
                <ReelFeed items={videos} emptyMessage="No videos available." />
            )}
        </main>
    );
};

export default Home;