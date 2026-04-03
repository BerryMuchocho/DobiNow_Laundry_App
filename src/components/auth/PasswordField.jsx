import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import Input from '../ui/Input'

function PasswordField({ value, onChange, placeholder, autoComplete = 'current-password' }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        icon={LockKeyhole}
        type={isVisible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="pr-12"
      />
      <button
        type="button"
        onClick={() => setIsVisible((previous) => !previous)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500"
      >
        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}

export default PasswordField
