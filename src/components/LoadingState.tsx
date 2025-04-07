import React from 'react';
import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';

interface LoadingStateProps {
  isLoading: boolean;
  error?: Error | string | null;
  children: React.ReactNode;
  loadingText?: string;
  errorText?: string;
  retryAction?: () => void;
  variant?: 'overlay' | 'skeleton' | 'inline';
  fullScreen?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  error,
  children,
  loadingText = 'Loading...',
  errorText = 'An error occurred. Please try again.',
  retryAction,
  variant = 'overlay',
  fullScreen = false
}) => {
  // If there's an error, show error state
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          textAlign: 'center',
          height: fullScreen ? '100vh' : 'auto',
          width: '100%'
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          {errorText}
        </Typography>
        {typeof error === 'string' ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {error}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {error.message}
          </Typography>
        )}
        {retryAction && (
          <button
            onClick={retryAction}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        )}
      </Box>
    );
  }

  // If loading, show loading state based on variant
  if (isLoading) {
    if (variant === 'skeleton') {
      return (
        <Box sx={{ width: '100%' }}>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={60} />
        </Box>
      );
    }

    if (variant === 'inline') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <CircularProgress size={20} sx={{ mr: 2 }} />
          <Typography variant="body2">{loadingText}</Typography>
        </Box>
      );
    }

    // Default overlay variant
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000,
          height: fullScreen ? '100vh' : '100%'
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body1">{loadingText}</Typography>
      </Box>
    );
  }

  // If not loading and no error, render children
  return <>{children}</>;
};

export default LoadingState; 