import { cn } from '../../lib/utils';

export function Input({ className, label, error, ...props }) {
  const id = props.id || props.name;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
