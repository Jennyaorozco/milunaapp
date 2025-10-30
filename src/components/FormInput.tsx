interface FormInputProps {
  type: 'text' | 'password' | 'email'
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

export function FormInput({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  required = false 
}: FormInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-3 mb-6 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
      style={{
        '--tw-ring-color': '#E55E99'
      } as React.CSSProperties}
    />
  )
}
