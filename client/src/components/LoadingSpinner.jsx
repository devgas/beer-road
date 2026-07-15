export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-b-2',
    lg: 'h-16 w-16 border-b-2',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-primary-500 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}
