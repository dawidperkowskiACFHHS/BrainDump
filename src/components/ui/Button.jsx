import { cn } from '../../lib/utils';

export function Button({ children, variant = 'primary', size = 'md', className, disabled, ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/20',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'hover:bg-white/10 text-gray-300 hover:text-white'
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-5',
    lg: 'h-14 px-8 text-lg'
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
