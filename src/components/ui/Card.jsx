export default function Card({ children, className = '', glowing = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#12121a] border border-white/[0.08] rounded-xl p-4
        transition-all duration-300
        ${glowing ? 'quest-active-glow' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
