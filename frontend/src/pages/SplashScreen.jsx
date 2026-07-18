import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import carVideo from '../assets/Car_animate.mp4';

const SplashScreen = () => {
  const navigate = useNavigate();
  const videoRef = React.useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video autoplay prevented', err));
    }
    
    // Navigate after 4.5 seconds (3 to 5 seconds as requested)
    const timer = setTimeout(() => {
      navigate('/redirect');
    }, 4500); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative bg-white">
      {/* Video Animation */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-md px-6">
        <div className="w-full max-w-xs mb-8 rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50 flex items-center justify-center">
          <video 
            ref={videoRef}
            autoPlay 
            loop
            muted 
            playsInline 
            className="w-full h-auto object-cover"
          >
            <source src={carVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <h1 className="text-4xl font-extrabold text-[#171a20] mt-4 tracking-tight">
          RideConnect
        </h1>
        <p className="text-slate-500 mt-2 text-lg font-medium tracking-wide">Enterprise Carpooling Platform</p>
        
        {/* Loading Bar */}
        <div className="w-48 h-1.5 bg-slate-200 rounded-full mt-12 overflow-hidden">
          <div className="h-full bg-[#171a20] rounded-full w-1/2 animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
