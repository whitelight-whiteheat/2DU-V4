import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { logError } from '../utils/errorLogging';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, 'Component Error', {
      componentName: errorInfo.componentStack?.split('\n')[1] || 'Unknown',
      actionName: 'component_did_catch',
      additionalData: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReportIssue = () => {
    // In a real application, this would open a modal or navigate to a support page
    console.log('Reporting issue:', this.state.error);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We're sorry, but something unexpected happened. Our team has been notified and we're working to fix the issue.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  textAlign: 'left',
                  overflow: 'auto',
                }}
              >
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleRetry}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleReportIssue}
              >
                Report Issue
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 