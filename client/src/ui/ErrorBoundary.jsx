import React from "react";
import logger from "../utils/logger";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logger.error(error, "ErrorBoundary", { componentStack: info?.componentStack });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <p className="mb-2 text-lg font-semibold text-slate-900">Something went wrong.</p>
            <p className="mb-5 text-sm text-slate-500">
              {this.state.error?.message ?? "An unexpected error interrupted the page."}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
