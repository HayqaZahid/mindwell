import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Mindwell caught a render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <p className="font-display text-xl text-pine dark:text-mist">Something went sideways.</p>
          <p className="text-sm text-ink/60 dark:text-mist/60 mt-2 max-w-sm">
            This page hit an error. Try reloading — your data is safe on the server.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-pine text-cloud rounded-lg px-5 py-2 text-sm font-medium hover:bg-pine2"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
