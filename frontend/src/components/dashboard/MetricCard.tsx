import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "risk-high" | "risk-medium" | "risk-low";
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = "default",
}: MetricCardProps) {
  const borderColors = {
    default: "border-t-primary",
    "risk-high": "border-t-risk-high",
    "risk-medium": "border-t-risk-medium",
    "risk-low": "border-t-risk-low",
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-risk-high" : trend === "down" ? "text-success" : "text-muted-foreground";

  return (
    <div
      className={cn(
        "metric-card border-t-2 fade-in",
        borderColors[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground font-mono">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          {icon}
        </div>
      </div>
      
      {trend && trendValue && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
          <TrendIcon className={cn("w-3 h-3", trendColor)} />
          <span className={cn("text-xs font-medium", trendColor)}>{trendValue}</span>
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}
