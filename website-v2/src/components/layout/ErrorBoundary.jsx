import React from 'react';

/**
 * Generic error boundary to prevent runtime errors from breaking
 * the entire application shell. It renders a minimal fallback
 * message while keeping the surrounding layout intact.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 px-4">
          <div className="max-w-xl text-center">
            <h1 className="text-2xl font-semibold mb-3">
              Something went wrong.
            </h1>
            <p className="text-sm text-gray-600">
              Please refresh the page or try again in a moment.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

