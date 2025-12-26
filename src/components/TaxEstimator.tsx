import { Calculator, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const scenarios = [
  {
    country: "Portugal",
    flag: "🇵🇹",
    regime: "NHR Regime",
    estimatedTax: "$8,240",
    effectiveRate: "8.8%",
    savings: "$14,760",
    highlight: true,
  },
  {
    country: "Spain",
    flag: "🇪🇸",
    regime: "Beckham Law",
    estimatedTax: "$12,480",
    effectiveRate: "13.3%",
    savings: "$10,520",
    highlight: false,
  },
  {
    country: "United Arab Emirates",
    flag: "🇦🇪",
    regime: "Tax Free",
    estimatedTax: "$0",
    effectiveRate: "0%",
    savings: "$23,000",
    highlight: false,
  },
];

const TaxEstimator = () => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Tax Optimization</h3>
            <p className="text-sm text-muted-foreground">Based on $93,800 annual income</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          Run Analysis
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario, index) => (
          <div 
            key={scenario.country}
            className={`relative p-4 rounded-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
              scenario.highlight 
                ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30" 
                : "bg-secondary/50 hover:bg-secondary"
            }`}
          >
            {scenario.highlight && (
              <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full gradient-primary text-xs font-medium text-primary-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Recommended
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{scenario.flag}</span>
                <div>
                  <p className="font-medium text-foreground">{scenario.country}</p>
                  <p className="text-sm text-muted-foreground">{scenario.regime}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-lg text-foreground">{scenario.estimatedTax}</p>
                <p className="text-sm text-muted-foreground">{scenario.effectiveRate} effective</p>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Potential savings vs. US tax</span>
              <span className="text-sm font-semibold text-primary">{scenario.savings}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-foreground">Pro Tip</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Combine Portugal's NHR regime with proper structure to potentially reduce your effective rate even further. Consult with our expert partners for personalized advice.
        </p>
      </div>
    </div>
  );
};

export default TaxEstimator;
