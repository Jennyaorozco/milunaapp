interface FormCardProps {
  children: React.ReactNode
}

export function FormCard({ children }: FormCardProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #CDB4DA 0%, #FFC8DC 25%, #FFAFCC 50%, #E55E99 75%, #EBB9DF 100%)',
        zIndex: 9999
      }}
    >
      <div className="w-full max-w-lg mx-2">
        <div
          className="rounded-2xl shadow-2xl p-12"
          style={{
            backgroundColor: 'white',
            color: 'rgb(31, 41, 55)'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
