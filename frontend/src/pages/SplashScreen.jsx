import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/redirect');
    }, 3000); // 3 seconds splash

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse"></div>
      
      {/* Logo & Animations */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl shadow-2xl flex items-center justify-center animate-bounce">
          <Car className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-8 tracking-tight">
          Commute<span className="text-primary-600">Connect</span>
        </h1>
        <p className="text-slate-500 mt-2 text-lg font-medium tracking-wide">Enterprise Carpooling Platform</p>
        
        {/* Loading Bar */}
        <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-12 overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full w-1/2 animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
