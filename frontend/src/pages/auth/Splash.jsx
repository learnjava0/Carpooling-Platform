import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { useAuth } from '../../hooks/useAuth';

function Splash() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isBootstrapping } = useAuth();

  useEffect(() => {
    if (isBootstrapping) return undefined;

    const timer = window.setTimeout(() => {
      // If user came from login, navigate to their desired next page.
      if (location.state?.next) {
        navigate(location.state.next, { replace: true });
      } else {
        navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
      }
    }, 2500); // 2.5 second splash display

    return () => window.clearTimeout(timer);
  }, [isAuthenticated, isBootstrapping, navigate, location]);

  return (
    <main className="splash-page" style={{ 
      background: 'var(--bg)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      margin: 0
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        aspectRatio: '16/9',
        border: '3px solid var(--text)',
        borderRadius: '32px',
        padding: '48px',
        background: 'var(--panel-solid)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)'
      }}>
        {/* Top Tablet-like Indent */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '6px',
          borderRadius: '4px',
          background: 'var(--line-strong)'
        }}></div>

        {/* Floating clouds / background grid logic from Sketch */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50px',
          background: 'linear-gradient(transparent, var(--line))',
          clipPath: 'polygon(0 100%, 100% 100%, 80% 0, 20% 0)'
        }}></div>

        {/* Left Side: Car Icon with Users */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Mock SVG Car based on Sketch */}
          <div style={{
            width: '160px',
            height: '110px',
            position: 'relative',
            border: '6px solid var(--text)',
            borderBottom: 'none',
            borderRadius: '40px 40px 10px 10px',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '20px',
            background: 'var(--panel-solid)'
          }}>
            {/* Windows / People */}
            <div style={{
              width: '130px',
              height: '50px',
              border: '4px solid var(--text)',
              borderRadius: '20px',
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'flex-end',
              paddingBottom: '4px'
            }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '3px solid var(--text)',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-12px',
                    left: '-4px',
                    right: '-4px',
                    height: '16px',
                    border: '3px solid var(--text)',
                    borderRadius: '10px 10px 0 0',
                    borderBottom: 'none'
                  }}></div>
                </div>
              ))}
            </div>

            {/* Bottom edge & bumpers */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '-20px',
              right: '-20px',
              height: '30px',
              border: '6px solid var(--text)',
              borderRadius: '12px',
              background: 'var(--panel-solid)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 10px'
            }}>
               <div style={{ width: '20px', height: '10px', border: '3px solid var(--text)', borderRadius: '10px' }}></div>
               <div style={{ width: '40px', height: '6px', background: 'var(--text)', borderRadius: '4px' }}></div>
               <div style={{ width: '20px', height: '10px', border: '3px solid var(--text)', borderRadius: '10px' }}></div>
            </div>
            {/* Wheels */}
            <div style={{ position: 'absolute', bottom: '-20px', left: '-5px', width: '24px', height: '30px', background: 'var(--text)', borderRadius: '8px' }}></div>
            <div style={{ position: 'absolute', bottom: '-20px', right: '-5px', width: '24px', height: '30px', background: 'var(--text)', borderRadius: '8px' }}></div>
          </div>
        </div>

        {/* Right Side: Text */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 800, 
            lineHeight: 1.1,
            color: 'var(--text)',
            margin: 0,
            letterSpacing: '-1px'
          }}>
            Ride Together
            <br />
            <span style={{ color: 'var(--muted)' }}>Save Together</span>
          </h1>
        </div>

        <div style={{ position: 'absolute', bottom: '32px', right: '48px' }}>
          <Loader label="Initializing..." />
        </div>
      </div>
    </main>
  );
}

export default Splash;
