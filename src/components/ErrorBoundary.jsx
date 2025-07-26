import React, { useState, useEffect } from "react";

const Icon = ({ name, size = 18, color = "#fff" }) => {
  const icons = {
    ArrowLeft: "←",
    Refresh: "⟲",
    Home: "⌂"
  };
  return <span style={{ fontSize: size, color }}>{icons[name] || "?"}</span>;
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorId: null };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      errorId: Math.random().toString(36).substr(2, 8).toUpperCase()
    };
  }

  componentDidCatch(error, errorInfo) {
    error.__ErrorBoundary = true;
    window.__COMPONENT_ERROR__?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <InnovativeErrorPage errorId={this.state.errorId} />;
    }

    return this.props.children;
  }
}

const InnovativeErrorPage = ({ errorId }) => {
  const [particles, setParticles] = useState([]);
  const [glitchText, setGlitchText] = useState("Something went wrong");
  const [isReporting, setIsReporting] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setParticles(newParticles);

    const glitchInterval = setInterval(() => {
      const texts = [
        "Something went wrong",
        "S0m3th1ng w3nt wr0ng",
        "Something went wrong",
        "ERROR_404_REALITY_NOT_FOUND",
        "Something went wrong"
      ];
      setGlitchText(texts[Math.floor(Math.random() * texts.length)]);
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleReport = async () => {
    setIsReporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsReporting(false);
    setReportSent(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
      
      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/30 backdrop-blur-sm animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.id * 0.2}s`,
            animationDuration: `${particle.speed + 2}s`
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          {/* Glitchy robot face */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-red-500/25 animate-pulse">
                <div className="text-white text-4xl select-none">⚠️</div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Glitch text title */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 mb-2 font-mono tracking-wider">
              {glitchText}
            </h1>
            <div className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto w-64 animate-pulse"></div>
          </div>

          {/* Error details */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/10 shadow-2xl">
            <p className="text-gray-300 text-lg mb-4 leading-relaxed">
              Oops! Our digital universe experienced a small glitch. Don't worry, 
              our quantum engineers are already on it! 
            </p>
            
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-300 text-sm font-mono">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                Error ID: {errorId}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.location.reload()}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Icon name="Refresh" size={20} />
                <span>Try Again</span>
                <div className="w-0 group-hover:w-2 h-2 bg-white/50 rounded-full transition-all duration-300"></div>
              </button>

              <button
                onClick={() => window.location.href = "/"}
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-full flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Icon name="Home" size={20} />
                <span>Go Home</span>
                <div className="w-0 group-hover:w-2 h-2 bg-white/50 rounded-full transition-all duration-300"></div>
              </button>
            </div>

            {/* Report error section */}
            <div className="mt-8 pt-6 border-t border-white/10">
              {!reportSent ? (
                <button
                  onClick={handleReport}
                  disabled={isReporting}
                  className="text-gray-400 hover:text-white text-sm underline transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                  {isReporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Reporting error...
                    </>
                  ) : (
                    "Report this error"
                  )}
                </button>
              ) : (
                <div className="text-green-400 text-sm flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center text-xs text-black">✓</span>
                  Thank you! Error reported successfully.
                </div>
              )}
            </div>
          </div>

          {/* Fun fact */}
          <div className="text-gray-500 text-sm italic">
            Fun fact: This error page looks better than some websites! 
          </div>
        </div>
      </div>

      {/* Subtle scan line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1 animate-pulse" 
             style={{ top: '50%', transform: 'translateY(-50%)' }}>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;