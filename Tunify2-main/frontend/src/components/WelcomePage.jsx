import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Music, Headphones, ChevronRight } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    // Background animation
    const bg = bgRef.current;
    if (bg) {
      bg.style.opacity = '0';
      setTimeout(() => {
        bg.style.transition = 'opacity 1.2s ease-out';
        bg.style.opacity = '1';
      }, 100);
    }
    
    // Card animation with sequence
    const card = cardRef.current;
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 600);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div 
        ref={bgRef} 
        className="absolute inset-0 bg-gradient-to-br from-violet-950 via-fuchsia-900 to-slate-900 z-0"
      >
        {/* Animated orbs */}
        <div className="absolute w-full h-full overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full mix-blend-soft-light"
              style={{
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, rgba(${Math.random() * 255}, ${Math.random() * 100 + 100}, ${Math.random() * 255}, 0.4) 0%, rgba(0,0,0,0) 70%)`,
                transform: 'translate(-50%, -50%)',
                animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDMwaDMwVjBoLTMwdjMwek0wIDMwaDMwdjMwSDB2LTMweiIgZmlsbD0iI2ZmZmZmZjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-10" />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-fuchsia-500 to-violet-600 blur-lg opacity-70 animate-pulse"></div>
              <div className="relative bg-gradient-to-tr from-fuchsia-600 to-violet-700 w-20 h-20 rounded-full flex items-center justify-center shadow-xl">
                <Music className="h-10 w-10 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-fuchsia-200 to-white animate-gradient-x mb-2">
            Tune-in
          </h1>
          <p className="text-fuchsia-200/80 text-lg font-light tracking-wide">Your Gateway to Musical Bliss</p>
        </div>
        
        {/* Main card */}
        <div 
          ref={cardRef}
          className="backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(192,38,211,0.15)]"
        >
          {/* Card content */}
          <div className="p-8 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-fuchsia-600/20 to-transparent rounded-bl-full -mr-10 -mt-10 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-violet-600/20 to-transparent rounded-tr-full -ml-10 -mb-10 blur-xl"></div>
            
            <div className="relative z-10 space-y-8">
              {/* Welcome message */}
              <div className="text-center mb-8">
                <Headphones className="h-12 w-12 mx-auto mb-4 text-fuchsia-300 animate-float" />
                <h2 className="text-2xl font-medium text-white mb-3">Experience Music Like Never Before</h2>
                <p className="text-fuchsia-100/70 max-w-sm mx-auto">
                  Discover new artists, create playlists, and enjoy your favorite tracks with enhanced sound quality.
                </p>
              </div>
              
              {/* Auth buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center"
                >
                  <span className="relative z-10 flex items-center">
                    Continue to Login
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button
                  onClick={() => navigate('/signup')}
                  className="w-full group relative overflow-hidden border border-fuchsia-500/30 hover:border-fuchsia-400/50 bg-white/5 hover:bg-white/10 text-fuchsia-100 font-medium py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
                >
                  <span className="relative z-10 flex items-center">
                    Create New Account
                    <ChevronRight className="ml-2 h-5 w-5 opacity-70 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer text */}
        <p className="text-center text-fuchsia-200/40 text-sm mt-8">
          © {new Date().getFullYear()} Tunify. All rights reserved.
        </p>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 8s ease infinite;
        }
        
        body {
          background-color: #0f0f0f;
        }
      `}</style>
    </div>
  );
}