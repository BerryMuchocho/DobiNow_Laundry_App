import { Component } from 'react'

class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : 'Unknown checkout error',
    }
  }

  componentDidCatch(error) {
    // This keeps the real error visible in the browser console while we debug safely.
    console.error('Checkout route error:', error)
  }

  render() {
    const { hasError, errorMessage } = this.state
    const { children } = this.props

    if (hasError) {
      return (
        <div className="space-y-4 rounded-[26px] border border-line bg-white p-5">
          <h1 className="text-lg font-extrabold text-ink-900">Checkout failed to render.</h1>
          <p className="text-sm leading-6 text-ink-500">
            The booking flow is still intact, but something on this page crashed.
          </p>
          <p className="rounded-2xl bg-slate-100 px-4 py-3 text-xs font-medium text-ink-700">
            Error: {errorMessage}
          </p>
        </div>
      )
    }

    return children
  }
}

export default RouteErrorBoundary
