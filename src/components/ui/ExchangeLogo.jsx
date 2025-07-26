const ExchangeLogo = ({ src, name, className = 'w-6 h-6' }) => {
  return (
    <div className={`${className} flex items-center justify-center bg-white/10 rounded-full overflow-hidden`}>
      <img 
        src={src} 
        alt={name}
        className="w-full h-full object-contain"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${name.charAt(0)}&background=10b981&color=fff`;
        }}
      />
    </div>
  );
};

export default ExchangeLogo;