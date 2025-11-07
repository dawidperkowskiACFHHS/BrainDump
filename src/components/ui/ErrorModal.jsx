import { motion } from 'framer-motion';
import { X, AlertCircle, Copy } from 'lucide-react';
import { useStore } from '../../lib/store';

export function ErrorModal() {
  const { error, clearError } = useStore();

  if (!error) return null;

  const copyError = () => {
    const errorText = `Error: ${error.message}\nEndpoint: ${error.endpoint}\nModel: ${error.model}\nTime: ${error.timestamp}\n\nStack:\n${error.stack || 'N/A'}`;
    navigator.clipboard.writeText(errorText);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border-2 border-red-500/50 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-bold text-red-500">API Error</h3>
          </div>
          <button
            onClick={clearError}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close error"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Error Message:</p>
            <p className="text-white font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {error.message}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">API Endpoint:</p>
            <p className="text-white font-mono text-sm bg-black/50 p-3 rounded-lg break-all">
              {error.endpoint}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Model:</p>
            <p className="text-white font-mono text-sm bg-black/50 p-3 rounded-lg">
              {error.model}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Timestamp:</p>
            <p className="text-white font-mono text-sm bg-black/50 p-3 rounded-lg">
              {new Date(error.timestamp).toLocaleString()}
            </p>
          </div>

          {error.stack && (
            <div>
              <p className="text-sm text-gray-400 mb-1">Stack Trace:</p>
              <pre className="text-xs text-gray-300 font-mono bg-black/50 p-3 rounded-lg overflow-x-auto">
                {error.stack}
              </pre>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={copyError}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy Error
          </button>
          <button
            onClick={clearError}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
