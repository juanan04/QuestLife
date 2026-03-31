export default function XPPopup({ amount }) {
  return (
    <div
      className="xp-popup absolute pointer-events-none z-50 font-bold text-sm"
      style={{
        fontFamily: "'Orbitron', sans-serif",
        color: '#f59e0b',
        textShadow: '0 0 8px rgba(245, 158, 11, 0.8)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        whiteSpace: 'nowrap'
      }}
    >
      +{amount} XP
    </div>
  );
}
