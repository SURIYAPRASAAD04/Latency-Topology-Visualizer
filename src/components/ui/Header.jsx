import React, { useState, useEffect } from 'react';
import { Search, Menu, Bell, Settings, ChevronDown, Zap, Globe, Activity } from 'lucide-react';

const Header = ({ onSidebarToggle, sidebarCollapsed , connections ,onSelect}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());
 
 const [isFocused, setIsFocused] = useState(false);
  
  useEffect(() => {
  

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


 const handleSelect = (value) => {
    setSearchQuery(value);
    onSelect(value); 
    setIsFocused(false);
  };
    const lowerQuery = searchQuery.toLowerCase();

  const matches = searchQuery
    ? connections.filter(conn =>
        conn.exchangeName.toLowerCase().includes(lowerQuery) ||
        conn.provider.toLowerCase().includes(lowerQuery)
      )
    : [];

  const suggestions = [
    ...new Set(matches.flatMap(conn => [conn.exchangeName, conn.provider]))
  ];
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-header backdrop-blur-xl">
      {/* Animated Green Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 via-green-800/95 to-teal-900/95 animate-gradient-x"></div>
      
      {/* Main Header Content */}
      <div className="relative flex items-center justify-between h-full px-6 lg:px-8">
        
        {/* Left Section - Logo & Brand */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            <Menu size={20} className="text-white" />
          </button>

          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* Animated Logo Container */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br to-black-200 p-0.5 shadow-lg shadow-green-500/30">
                <div className="w-full h-full rounded-xl bg-gradient-to-br flex items-center justify-center">
                  <div>
                    <img
                      src="assets/images/logo.png"
                      alt="Logo"
                      className="w-9 h-9  object-cover"/>
                  </div>
                </div>
              </div>
              {/* Status Indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Latency Monitor
              </h1>
              <p className="text-green-200/80 text-sm font-medium">
                Real-time Network Analytics
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Enhanced Search */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <div className="relative">
            {/* Search Container with Glass Effect */}
            <div className={`
              relative rounded-full bg-white/10 backdrop-blur-md border border-white/20
              transition-all duration-300 ${isSearchFocused ? 'bg-white/15 border-white/30 shadow-lg shadow-green-500/20' : ''}
            `}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className={`transition-colors duration-300 ${isSearchFocused ? 'text-green-300' : 'text-white/60'}`} />
              </div>
              
              <input
                type="text"
                placeholder="Search  exchanger, providers..."
                value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
      className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none rounded-full"
              /> {isFocused && suggestions.length  > 0 && (
        <ul  className="absolute top-full mt-2 left-0 right-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 py-2 shadow-xl">
       
        {suggestions.map((item, idx) => (
            <li
              key={idx}
              className="px-4 py-2 text-white/80 text-sm hover:bg-white/10 cursor-pointer transition-colors"
              onClick={() => handleSelect(item)}
            >
              {item}
            </li>
         
          ))}
        </ul>
      )}
              
          
            
            </div>
          </div>
        </div>

        {/* Right Section - Status & Profile */}
        <div className="flex items-center space-x-3 lg:space-x-4">
          
          {/* Live Status Card */}
          <div className="hidden lg:flex items-center space-x-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <div className="flex items-center space-x-2">
              <Activity size={16} className="text-green-400" />
              <span className="text-white text-sm font-medium">Live</span>
            </div>
            <div className="w-px h-4 bg-white/30"></div>
            <span className="text-green-200 text-xs font-mono">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {/* Performance Indicator */}
            <button className="hidden lg:flex p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm group">
              <Zap size={18} className="text-green-400 group-hover:text-green-300 transition-colors" />
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm group">
              <Bell size={18} className="text-white group-hover:text-green-300 transition-colors" />
              {notifications > 0 && (
                <>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-xs font-bold">{notifications}</span>
                  </div>
                </>
              )}
            </button>

            
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-medium">Denis Dariotis</p>
              <p className="text-green-200/80 text-xs">Founder & CEO | GoQuant</p>
            </div>
            
            {/* Profile Image with Status Ring */}
            <button className="relative group">
              <div className="w-11 h-11 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 p-0.5 shadow-lg shadow-green-500/30">
                <img
                  src="https://media.licdn.com/dms/image/v2/D5603AQHzUZa_CdFVkw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1721940299728?e=1756339200&v=beta&t=7Xs6qXZdnkkmej7RxwHob0bwE4QxNc7W4m39pKr7-qU"
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-white/20"
                />
              </div>
              
              {/* Online Status */}
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
              
              {/* Dropdown Indicator */}
              <ChevronDown size={14} className="absolute -bottom-1 -right-1 text-white/70 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Mobile Search Toggle */}
          <button className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
            <Search size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Subtle Bottom Border Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
    </header>
  );
};

export default Header;