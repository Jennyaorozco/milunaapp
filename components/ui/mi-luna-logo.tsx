type LogoSize = "small" | "medium" | "large"

interface MiLunaLogoProps {
  size?: LogoSize
}

export function MiLunaLogo({ size = "medium" }: MiLunaLogoProps) {
  const sizes = {
    small: {
      container: "w-24",
      text: "text-lg mb-1",
      image: { width: 60, height: 60 },
    },
    medium: {
      container: "w-32",
      text: "text-2xl mb-2",
      image: { width: 80, height: 80 },
    },
    large: {
      container: "w-48",
      text: "text-3xl mb-3",
      image: { width: 120, height: 120 },
    },
  }

  const sizeConfig = sizes[size]

  return (
    <div className={`flex flex-col items-center ${sizeConfig.container}`}>
      <h1 className={`font-bold text-pink-700 ${sizeConfig.text}`}>Mi Luna</h1>
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M50 15 C70 0, 90 25, 85 45 C80 65, 65 80, 50 85 C35 80, 20 65, 15 45 C10 25, 30 0, 50 15"
              fill="#FFC0CB"
              stroke="#FF69B4"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="relative z-10">
          <svg
            viewBox="0 0 100 100"
            width={sizeConfig.image.width}
            height={sizeConfig.image.height}
            className="text-pink-600"
          >
            <path
              d="M50 30 C60 30, 70 40, 70 50 C70 60, 60 70, 50 70 C40 70, 30 60, 30 50 C30 40, 40 30, 50 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              d="M30 50 C30 70, 50 80, 50 80 C50 80, 70 70, 70 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <circle cx="30" cy="40" r="5" fill="currentColor" />
            <circle cx="70" cy="40" r="5" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  )
}
