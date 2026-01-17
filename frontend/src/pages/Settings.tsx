import { 
  Settings as SettingsIcon, 
  Database,
  Bell,
  Shield,
  Users,
  Sliders,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Settings() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 text-primary" />
          System Configuration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure agents, thresholds, and system parameters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Navigation */}
        <div className="space-y-2">
          {[
            { icon: Sliders, label: "Risk Scoring", active: true },
            { icon: Bell, label: "Alert Rules", active: false },
            { icon: Database, label: "Data Sources", active: false },
            { icon: Shield, label: "Security", active: false },
            { icon: Users, label: "Team", active: false },
          ].map((item, index) => (
            <button
              key={index}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
                item.active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Column - Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Scoring Weights */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Risk Scoring Formula</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Adjust agent weights for final risk score calculation
              </p>
            </div>
            <div className="p-4 space-y-6">
              {[
                { name: "Transaction Analysis", weight: 30, description: "Flow structure & centrality" },
                { name: "Pattern Detection", weight: 30, description: "Smurfing, layering, cycles" },
                { name: "Correlation Agent", weight: 20, description: "Behavioral similarity" },
                { name: "Timeline Reconstruction", weight: 20, description: "Temporal coordination" },
              ].map((agent, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium text-foreground">{agent.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({agent.description})</span>
                    </div>
                    <span className="font-mono text-sm text-primary">{agent.weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={agent.weight}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-border">
                <div className="terminal-panel p-3 font-mono text-xs">
                  <span className="terminal-accent">Final Risk = </span>
                  <span className="text-muted-foreground">
                    0.30 × Flow + 0.30 × Pattern + 0.20 × Correlation + 0.20 × Timeline
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Thresholds */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Alert Thresholds</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-foreground">High Risk Threshold</span>
                  <p className="text-xs text-muted-foreground">Accounts scoring above this trigger critical alerts</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value="0.80"
                    step="0.05"
                    className="w-20 px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono text-foreground text-right"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-foreground">Medium Risk Threshold</span>
                  <p className="text-xs text-muted-foreground">Accounts between this and high trigger warnings</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value="0.50"
                    step="0.05"
                    className="w-20 px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono text-foreground text-right"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-foreground">Transaction Threshold</span>
                  <p className="text-xs text-muted-foreground">Amount below which structuring is suspected</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value="5000"
                    className="w-24 px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono text-foreground text-right"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pattern Detection */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Pattern Detection Rules</h3>
            </div>
            <div className="p-4 space-y-4">
              {[
                { name: "Smurfing", description: "Multiple sub-threshold transfers", enabled: true },
                { name: "Layering", description: "Multi-hop fund movement", enabled: true },
                { name: "Cycle Detection", description: "Money returning to origin", enabled: true },
                { name: "Burst Detection", description: "Rapid transaction sequences", enabled: true },
              ].map((pattern, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-foreground">{pattern.name}</span>
                    <p className="text-xs text-muted-foreground">{pattern.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={pattern.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:bg-primary-foreground"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
