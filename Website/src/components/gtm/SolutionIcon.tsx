import React from "react";

type IconType = "building-columns" | "target" | "map" | "building" | "stage";

interface SolutionIconProps {
  icon: IconType;
  size?: number;
  color?: string;
}

export const SolutionIcon: React.FC<SolutionIconProps> = ({
  icon,
  size = 24,
  color = "currentColor",
}) => {
  const strokeWidth = 1;
  const viewBox = "0 0 24 24";

  const icons: Record<IconType, React.ReactNode> = {
    "building-columns": (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9V5c0-1 .5-2 1-2h2c.5 0 1 1 1 2v4" />
        <path d="M9 9V5c0-1 .5-2 1-2h2c.5 0 1 1 1 2v4" />
        <path d="M15 9V5c0-1 .5-2 1-2h2c.5 0 1 1 1 2v4" />
        <rect x="2" y="9" width="20" height="2" />
        <rect x="2" y="11" width="3" height="9" />
        <rect x="7" y="11" width="3" height="9" />
        <rect x="12" y="11" width="3" height="9" />
        <rect x="17" y="11" width="3" height="9" />
      </svg>
    ),
    target: (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="1" fill={color} />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    map: (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 7l3-2 6 4 6-3 3 2v10l-3 2-6-4-6 3-3-2V7z" />
        <line x1="9" y1="5" x2="9" y2="19" />
        <line x1="15" y1="2" x2="15" y2="22" />
      </svg>
    ),
    building: (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3h18v18H3z" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
      </svg>
    ),
    stage: (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 16h20M2 16l2-8h16l2 8M6 16v3M18 16v3M9 8h6M8 5h8M6 12h12" />
      </svg>
    ),
  };

  return <>{icons[icon]}</>;
};
