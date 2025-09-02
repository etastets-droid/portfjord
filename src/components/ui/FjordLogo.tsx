interface FjordLogoProps {
  className?: string;
  size?: number;
}

export function FjordLogo({ className = "", size = 120 }: FjordLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stylized fish/eye symbol inspired by the original logo */}
      <g opacity="0.3">
        {/* Main fish body outline */}
        <path
          d="M20 60C20 60 35 35 60 35C85 35 100 60 100 60C100 60 85 85 60 85C35 85 20 60 20 60Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Inner eye/pupil */}
        <circle
          cx="60"
          cy="60"
          r="12"
          fill="currentColor"
        />
        
        {/* Decorative lines */}
        <path
          d="M25 55C30 50 35 48 40 50"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M25 65C30 70 35 72 40 70"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Tail fin suggestion */}
        <path
          d="M95 55L105 50M95 65L105 70"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}