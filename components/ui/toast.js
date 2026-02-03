import { Toaster } from 'react-hot-toast';
import classes from './toast.module.css';

export function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: classes.toast,
        success: {
          className: classes.successToast,
          iconTheme: {
            primary: '#d4af37',
            secondary: '#1a0a1f',
          },
        },
        error: {
          className: classes.errorToast,
          iconTheme: {
            primary: '#ff5757',
            secondary: '#1a0a1f',
          },
        },
        loading: {
          className: classes.loadingToast,
        },
        duration: 4000,
      }}
    />
  );
}