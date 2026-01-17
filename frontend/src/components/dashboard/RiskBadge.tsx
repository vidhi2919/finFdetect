import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: "high" | "medium" | "low" | "unknown";
  score?: number;
  size?: "sm" | "md";
}

export function RiskBadge({ level, score, size = "md" }: RiskBadgeProps) {
  const baseClasses = "inline-flex items-center gap-1.5 font-medium rounded-full";
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  const levelClasses = {
    high: "risk-badge-high",
    medium: "risk-badge-medium",
    low: "risk-badge-low",
    unknown: "bg-muted text-muted-foreground border border-border",
  };

  const labels = {
    high: "High Risk",
    medium: "Medium Risk",
    low: "Low Risk",
    unknown: "Unknown",
  };

  return (
    <span className={cn(baseClasses, sizeClasses[size], levelClasses[level])}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {labels[level]}
      {score !== undefined && (
        <span className="font-mono opacity-75">({(score * 100).toFixed(0)}%)</span>
      )}
    </span>
  );
}
