import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AuthFormShell from '../components/auth/AuthFormShell'
import PasswordField from '../components/auth/PasswordField'
import Button from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const otpState = useAuthStore((state) => state.otpState)
  const resetPassword = useAuthStore((state) => state.resetPassword)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!otpState.recoveryDraft) {
      navigate('/forgot-password', { replace: true })
    }
  }, [navigate, otpState.recoveryDraft])

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {}

    if (!password.trim()) nextErrors.password = 'Enter a new password.'
    if (!confirmPassword.trim()) nextErrors.confirmPassword = 'Confirm your new password.'
    if (password && confirmPassword && password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      return
    }

    resetPassword()
    navigate('/login')
  }

  return (
    <AuthFormShell
      eyebrow="New password"
      title="Choose a fresh password."
      subtitle="This update is stored in frontend mock state only for now."
      footer={
        <Link to="/login" className="font-bold text-brand-600">
          Back to login
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-bold text-ink-900">New password</label>
          <PasswordField
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your new password"
            autoComplete="new-password"
          />
          {errors.password ? <p className="text-xs text-red-500">{errors.password}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-ink-900">Confirm new password</label>
          <PasswordField
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your new password"
            autoComplete="new-password"
          />
          {errors.confirmPassword ? (
            <p className="text-xs text-red-500">{errors.confirmPassword}</p>
          ) : null}
        </div>

        <Button fullWidth type="submit">
          Save password
        </Button>
      </form>
    </AuthFormShell>
  )
}

export default ResetPasswordPage
