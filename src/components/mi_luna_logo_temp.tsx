export function MiLunaLogo({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const sizes = {
    small: "text-2xl",
    medium: "text-4xl",
    large: "text-6xl"
  };

  return (
    <div className={`font-bold text-pink-700 ${sizes[size]}`}>
      🌙 Mi Luna
    </div>
  );
}
