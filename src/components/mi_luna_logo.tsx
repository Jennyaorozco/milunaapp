import { Moon } from 'lucide-react';

export function MiLunaLogo({ size = "medium", stacked = false, className = '' }: { size?: "small" | "medium" | "large", stacked?: boolean, className?: string }) {
  const sizes = {
    small: { text: "text-xl", icon: "w-6 h-6" },
    medium: "text-3xl",
    large: "text-5xl"
  };

  const iconSizes = {
    small: "w-6 h-6",
    medium: "w-8 h-8", 
    large: "w-12 h-12"
  };

  if (stacked) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <Moon className={`${iconSizes[size]}`} fill="currentColor" />
        <span className={`mt-2 meddon-regular ${typeof sizes[size] === 'string' ? sizes[size] : sizes[size].text}`} style={{ fontFamily: 'Meddon, cursive' }}>Mi Luna</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className} ${typeof sizes[size] === 'string' ? sizes[size] : sizes[size].text}`}>
      <Moon className={`${iconSizes[size]}`} fill="currentColor" />
      <span className={`meddon-regular`} style={{ fontFamily: 'Meddon, cursive' }}>Mi Luna</span>
    </div>
  );
}
