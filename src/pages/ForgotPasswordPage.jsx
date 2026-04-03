import { AtSign, Phone } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthFormShell from '../components/auth/AuthFormShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const beginPasswordRecovery = useAuthStore((state) => state.beginPasswordRecovery)
  const [target, setTarget] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!target.trim()) {
      setError('Enter your email or phone number.')
      return
    }

    setError('')
    beginPasswordRecovery(target.trim())
    navigate('/verify-otp')
  }

  return (
    <AuthFormShell
      eyebrow="Password help"
      title="Reset your password."
      subtitle="This is a frontend-only mock recovery flow. No real OTP is sent yet."
      footer={
        <Link to="/login" className="font-bold text-brand-600">
          Back to login
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-bold text-ink-900">Email or phone</label>
          <Input
            icon={target.includes('@') ? AtSign : Phone}
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="name@example.com or +254 700 000 000"
          />
          <p className="text-xs leading-5 text-ink-500">
            We will route you to mock OTP verification next.
          </p>
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
        </div>

        <Button fullWidth type="submit">
          Send OTP
        </Button>
      </form>
    </AuthFormShell>
  )
}

export default ForgotPasswordPage
