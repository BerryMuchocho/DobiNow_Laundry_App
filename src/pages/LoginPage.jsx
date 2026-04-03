import { AtSign, Phone } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthFormShell from '../components/auth/AuthFormShell'
import PasswordField from '../components/auth/PasswordField'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'
import { useState } from 'react'

function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [credential, setCredential] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {}

    if (!credential.trim()) {
      nextErrors.credential = 'Enter your email or phone number.'
    }

    if (!password.trim()) {
      nextErrors.password = 'Enter your password.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      return
    }

    login(credential.trim())
    navigate('/profile')
  }

  return (
    <AuthFormShell
      eyebrow="Welcome back"
      title="Log in to keep laundry moving."
      subtitle="Access your orders, saved addresses, and pickup history with your mock DobiNow account."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-bold text-brand-600">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-bold text-ink-900">Email or phone</label>
          <Input
            icon={credential.includes('@') ? AtSign : Phone}
            value={credential}
            onChange={(event) => setCredential(event.target.value)}
            placeholder="name@example.com or +254 700 000 000"
            autoComplete="username"
          />
          {errors.credential ? <p className="text-xs text-red-500">{errors.credential}</p> : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-bold text-ink-900">Password</label>
            <Link to="/forgot-password" className="text-xs font-bold text-brand-600">
              Forgot password?
            </Link>
          </div>
          <PasswordField
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />
          {errors.password ? <p className="text-xs text-red-500">{errors.password}</p> : null}
        </div>

        <Button fullWidth type="submit" className="mt-2">
          Log in
        </Button>
      </form>
    </AuthFormShell>
  )
}

export default LoginPage
