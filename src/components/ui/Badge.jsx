export default function Badge({ children, color = '#7c3aed', variant = 'solid', className = '' }) {
  const style = variant === 'outline'
    ? { border: `1px solid ${color}`, color, backgroundColor: 'transparent' }
    : { backgroundColor: `${color}20`, color, border: `1px solid ${color}40` };

  return (
    <span
      style={style}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}
