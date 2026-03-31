import { Star } from 'lucide-react';

export default function DifficultyStars({ difficulty = 1, max = 5, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < difficulty ? 'text-[#f59e0b]' : 'text-[#2d2d3d]'}
          fill={i < difficulty ? '#f59e0b' : 'none'}
        />
      ))}
    </div>
  );
}
