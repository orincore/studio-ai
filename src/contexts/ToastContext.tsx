import React, { createContext, useContext, useState } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { ...newToast, id };
    setToasts((prevToasts) => [...prevToasts, toast]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismissToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg shadow-lg p-4 flex items-start space-x-3 max-w-sm transform transition-all duration-300 ease-in-out animate-slide-up ${
              toast.variant === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
              toast.variant === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
              toast.variant === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
              'bg-blue-50 border-l-4 border-blue-500'
            }`}
          >
            <div className="flex-1">
              <h3 className={`font-medium ${
                toast.variant === 'success' ? 'text-green-800' :
                toast.variant === 'error' ? 'text-red-800' :
                toast.variant === 'warning' ? 'text-yellow-800' :
                'text-blue-800'
              }`}>
                {toast.title}
              </h3>
              {toast.description && (
                <p className={`text-sm mt-1 ${
                  toast.variant === 'success' ? 'text-green-700' :
                  toast.variant === 'error' ? 'text-red-700' :
                  toast.variant === 'warning' ? 'text-yellow-700' :
                  'text-blue-700'
                }`}>
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className={`shrink-0 ${
                toast.variant === 'success' ? 'text-green-500 hover:text-green-700' :
                toast.variant === 'error' ? 'text-red-500 hover:text-red-700' :
                toast.variant === 'warning' ? 'text-yellow-500 hover:text-yellow-700' :
                'text-blue-500 hover:text-blue-700'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}; 