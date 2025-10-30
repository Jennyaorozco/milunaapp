interface PinkButtonProps {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export function PinkButton({ children, type = 'button', onClick }: PinkButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full p-3 text-white border-none rounded-lg text-base cursor-pointer mt-4 transition-all duration-150 hover:shadow-md"
      style={{
        background: '#E55E99'
      }}
    >
      {children}
    </button>
  )
}

