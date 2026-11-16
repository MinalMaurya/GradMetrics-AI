import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  chartName?: string;
  height?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ChartErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(`ChartErrorBoundary caught an error in ${this.props.chartName || 'chart'}:`, error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      const height = this.props.height || 'h-[320px]';
      return (
        <div
          role="alert"
          aria-live="polite"
          className={`w-full ${height} rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center shadow-xs transition-colors`}
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {this.props.chartName ? `${this.props.chartName} Temporarily Unavailable` : 'Interactive Chart Unavailable'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md leading-relaxed">
            The visualization module encountered a loading or rendering interruption. All underlying workforce telemetry, table records, and policy tools remain accessible.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Visualization</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
