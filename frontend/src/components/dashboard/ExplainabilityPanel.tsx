import { FileText, Scale, BookOpen, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LegalReference {
  title: string;
  section: string;
  relevance: string;
}

interface ExplanationData {
  summary: string;
  patternDetails: string;
  legalReferences: LegalReference[];
  recommendation: string;
}

const mockExplanation: ExplanationData = {
  summary:
    "Account ACC-7821 exhibits classic smurfing behavior with high confidence. Multiple sub-threshold transactions were executed in rapid succession to evade reporting requirements.",
  patternDetails:
    "47 transactions totaling ₹2,45,000 were split across 12 recipient accounts within a 15-minute window. Each transaction was carefully structured below the ₹5,000 reporting threshold, suggesting deliberate structuring intent.",
  legalReferences: [
    {
      title: "Prevention of Money Laundering Act, 2002",
      section: "Section 3 - Offence of Money Laundering",
      relevance:
        "The pattern of structuring transactions to avoid reporting thresholds constitutes 'structuring' under PMLA guidelines.",
    },
    {
      title: "RBI Master Direction on KYC",
      section: "Para 38 - Suspicious Transaction Reporting",
      relevance:
        "Transactions designed to avoid CTR thresholds require mandatory STR filing within 7 days.",
    },
    {
      title: "FATF Guidance on Smurfing",
      section: "Typology Report 2023",
      relevance:
        "Pattern matches 'Structuring/Smurfing' typology with split transactions and rapid layering characteristics.",
    },
  ],
  recommendation:
    "Immediate investigation recommended. Freeze account pending review. File STR with FIU-IND within 7 days as per RBI guidelines.",
};

export function ExplainabilityPanel() {
  const [expandedSection, setExpandedSection] = useState<string | null>("summary");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          AI Explainability Report
        </h3>
        <span className="ml-auto px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
          RAG-Generated
        </span>
      </div>

      <div className="divide-y divide-border">
        {/* Summary Section */}
        <div>
          <button
            onClick={() => toggleSection("summary")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Investigation Summary
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                expandedSection === "summary" && "rotate-180"
              )}
            />
          </button>
          {expandedSection === "summary" && (
            <div className="px-4 pb-4 fade-in">
              <div className="terminal-panel p-3 text-sm leading-relaxed">
                <p className="terminal-text">{mockExplanation.summary}</p>
                <p className="mt-3 text-muted-foreground">
                  {mockExplanation.patternDetails}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Legal References Section */}
        <div>
          <button
            onClick={() => toggleSection("legal")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Legal & Regulatory Context
              </span>
              <span className="px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                {mockExplanation.legalReferences.length}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                expandedSection === "legal" && "rotate-180"
              )}
            />
          </button>
          {expandedSection === "legal" && (
            <div className="px-4 pb-4 space-y-3 fade-in">
              {mockExplanation.legalReferences.map((ref, index) => (
                <div
                  key={index}
                  className="bg-muted/30 rounded-lg p-3 border border-border"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded font-mono">
                      REF-{index + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">
                        {ref.title}
                      </h4>
                      <p className="text-xs text-primary font-mono">
                        {ref.section}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {ref.relevance}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendation Section */}
        <div className="px-4 py-3 bg-risk-high/5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-risk-high/20 flex items-center justify-center flex-shrink-0">
              <Scale className="w-4 h-4 text-risk-high" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">
                Recommended Action
              </h4>
              <p className="text-sm text-muted-foreground">
                {mockExplanation.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
