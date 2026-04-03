import { create } from 'zustand'

function createEmptyOtpState() {
  return {
    authFlowType: '',
    pendingVerificationTarget: '',
    signupDraft: null,
    recoveryDraft: null,
    resetCompleted: false,
  }
}

function createUserFromSignupDraft(signupDraft) {
  if (!signupDraft) {
    return null
  }

  return {
    fullName: signupDraft.fullName,
    email: signupDraft.email,
    phone: signupDraft.phone,
  }
}

export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  authUser: null,
  otpState: createEmptyOtpState(),

  beginSignup: (signupDraft) =>
    set({
      otpState: {
        authFlowType: 'signup',
        pendingVerificationTarget: signupDraft.email || signupDraft.phone,
        signupDraft,
        recoveryDraft: null,
        resetCompleted: false,
      },
    }),

  login: (credential) =>
    set({
      isAuthenticated: true,
      authUser: {
        fullName: credential.includes('@') ? 'DobiNow Customer' : 'Returning Customer',
        email: credential.includes('@') ? credential : 'customer@dobinow.app',
        phone: credential.includes('@') ? '+254 700 000 000' : credential,
      },
      otpState: createEmptyOtpState(),
    }),

  beginPasswordRecovery: (target) =>
    set({
      otpState: {
        authFlowType: 'forgot-password',
        pendingVerificationTarget: target,
        signupDraft: null,
        recoveryDraft: { target },
        resetCompleted: false,
      },
    }),

  verifyOtp: (otpCode) => {
    const normalizedCode = otpCode.trim()
    const isValidOtp = normalizedCode === '1234' || normalizedCode === '0000'

    if (!isValidOtp) {
      return {
        ok: false,
        message: 'Use mock OTP 1234 or 0000 for this frontend flow.',
      }
    }

    const { otpState } = get()

    if (otpState.authFlowType === 'signup') {
      const authUser = createUserFromSignupDraft(otpState.signupDraft)

      set({
        isAuthenticated: true,
        authUser,
        otpState: createEmptyOtpState(),
      })

      return {
        ok: true,
        nextRoute: '/profile',
      }
    }

    if (otpState.authFlowType === 'forgot-password') {
      return {
        ok: true,
        nextRoute: '/reset-password',
      }
    }

    return {
      ok: false,
      message: 'There is no verification flow in progress.',
    }
  },

  resendOtp: () => ({
    ok: true,
    message: 'Mock OTP resent. Use 1234 or 0000 to continue.',
  }),

  resetPassword: () =>
    set((state) => ({
      otpState: {
        ...state.otpState,
        authFlowType: '',
        pendingVerificationTarget: '',
        recoveryDraft: null,
        resetCompleted: true,
      },
    })),

  clearOtpFlow: () =>
    set((state) => ({
      otpState: {
        ...createEmptyOtpState(),
        resetCompleted: state.otpState.resetCompleted,
      },
    })),

  logout: () =>
    set({
      isAuthenticated: false,
      authUser: null,
      otpState: createEmptyOtpState(),
    }),
}))
