import { useStore } from '../../lib/store';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export function Toast() {
  const { toast, showToast } = useStore();
  
  if (!toast) return null;
  
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };
  
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };
  
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-md text-white shadow-lg ${colors[toast.type]}`}
    >
      {icons[toast.type]}
      <span>{toast.message}</span>
      <button
        onClick={() => showToast(null)}
        className="ml-2 hover:opacity-80"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
