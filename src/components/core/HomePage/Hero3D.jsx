import React from 'react';

export default function Hero3D() {
  return (
    <div style={{ width: 600, height: 500 }} className="relative overflow-hidden rounded-2xl">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ 
          width: '100%', 
          height: '100%',
          objectFit: 'cover',
          borderRadius: '16px'
        }}
      >
        <source 
          src="https://res.cloudinary.com/dsg5tzzdg/video/upload/v1753903200/Incorrect_Video_Delivered_Request_Correction_msxha5.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>
      
      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-2xl"></div>
    </div>
  );
} 