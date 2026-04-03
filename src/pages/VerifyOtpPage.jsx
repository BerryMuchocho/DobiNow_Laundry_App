import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AuthFormShell from '../components/auth/AuthFormShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'

function VerifyOtpPage() {
  const navigate = useNavigate()
  const otpState = useAuthStore((state) => state.otpState)
  const verifyOtp = useAuthStore((state) => state.verifyOtp)
  const resendOtp = useAuthStore((state) => state.resendOtp)
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [resendCountdown, setResendCountdown] = useState(30)

  useEffect(() => {
    if (!otpState.authFlowType) {
      navigate('/login', { replace: true })
    }
  }, [navigate, otpState.authFlowType])

  useEffect(() => {
    if (resendCountdown <= 0) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setResendCountdown((previous) => previous - 1)
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [resendCountdown])

  function handleVerify(event) {
    event.preventDefault()

    if (!otpCode.trim()) {
      setError('Enter the mock OTP to continue.')
      return
    }

    const result = verifyOtp(otpCode)

    if (!result.ok) {
      setError(result.message)
      return
    }

    setError('')
    navigate(result.nextRoute)
  }

  function handleResend() {
    const result = resendOtp()
    setSuccessMessage(result.message)
    setResendCountdown(30)
  }

  return (
    <AuthFormShell
      eyebrow="Verification"
      title="Enter your OTP code."
      subtitle={`Frontend mock only. Use 1234 or 0000 for ${otpState.pendingVerificationTarget || 'this verification step'}.`}
      footer={
        <Link
          to={otpState.authFlowType === 'signup' ? '/signup' : '/forgot-password'}
          className="font-bold text-brand-600"
        >
          Go back
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleVerify}>
        <div className="space-y-2">
          <label className="text-sm font-bold text-ink-900">OTP code</label>
          <Input
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="1234"
            inputMode="numeric"
            autoComplete="one-time-code"
          />
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          {successMessage ? <p className="text-xs text-emerald-600">{successMessage}</p> : null}
        </div>

        <Button fullWidth type="submit">
          Verify OTP
        </Button>

        <Button
          fullWidth
          type="button"
          variant="outline"
          onClick={handleResend}
          disabled={resendCountdown > 0}
        >
          {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend code'}
        </Button>
      </form>
    </AuthFormShell>
  )
}

export default VerifyOtpPage
