import { AtSign, CheckSquare, Phone, Square, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthFormShell from '../components/auth/AuthFormShell'
import PasswordField from '../components/auth/PasswordField'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email)
}

function SignupPage() {
  const navigate = useNavigate()
  const beginSignup = useAuthStore((state) => state.beginSignup)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  })
  const [errors, setErrors] = useState({})

  function updateField(key, value) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {}

    if (!form.fullName.trim()) nextErrors.fullName = 'Enter your full name.'
    if (!form.email.trim()) nextErrors.email = 'Enter your email address.'
    if (form.email.trim() && !isValidEmail(form.email.trim())) nextErrors.email = 'Enter a valid email.'
    if (!form.phone.trim()) nextErrors.phone = 'Enter your phone number.'
    if (!form.password.trim()) nextErrors.password = 'Create a password.'
    if (!form.confirmPassword.trim()) nextErrors.confirmPassword = 'Confirm your password.'
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      return
    }

    beginSignup({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    })
    navigate('/verify-otp')
  }

  return (
    <AuthFormShell
      eyebrow="Create account"
      title="Set up your DobiNow account."
      subtitle="Save your details once so pickup booking and delivery updates stay simple every time."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600">
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-bold text-ink-900">Full name</label>
          <Input
            icon={UserRound}
            value={form.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            placeholder="Damaris Mwende"
            autoComplete="name"
          />
          {errors.fullName ? <p className="text-xs text-red-500">{errors.fullName}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-ink-900">Email</label>
          <Input
            icon={AtSign}
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
          />
          {errors.email ? <p className="text-xs text-red-500">{errors.email}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-ink-900">Phone number</label>
          <Input
            icon={Phone}
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            placeholder="+254 700 000 000"
            autoComplete="tel"
          />
          {errors.phone ? <p className="text-xs text-red-500">{errors.phone}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-ink-900">Password</label>
          <PasswordField
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            placeholder="Create a password"
            autoComplete="new-password"
          />
          {errors.password ? <p className="text-xs text-red-500">{errors.password}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-ink-900">Confirm password</label>
          <PasswordField
            value={form.confirmPassword}
            onChange={(event) => updateField('confirmPassword', event.target.value)}
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
          {errors.confirmPassword ? (
            <p className="text-xs text-red-500">{errors.confirmPassword}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => updateField('agreedToTerms', !form.agreedToTerms)}
          className="flex items-center gap-3 text-left text-sm text-ink-700"
        >
          {form.agreedToTerms ? (
            <CheckSquare size={18} className="text-brand-600" />
          ) : (
            <Square size={18} className="text-ink-500" />
          )}
          <span>I agree to DobiNow terms and pickup updates.</span>
        </button>

        <Button fullWidth type="submit" className="mt-2">
          Sign up
        </Button>
      </form>
    </AuthFormShell>
  )
}

export default SignupPage
