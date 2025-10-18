import React from 'react';

// Simple security wrapper component
export const withSecurity = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    React.useEffect(() => {
      // Disable right-click context menu in production
      if (process.env.NODE_ENV === 'production') {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};
