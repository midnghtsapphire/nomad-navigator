import { useState, useEffect } from "react";
import { Calculator, ChevronRight, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type TaxScenario = {
  country: string;
  flag: string;
  regime: string;
  estimatedTax: string;
  effectiveRate: string;
  savings: string;
  highlight: boolean;
};

// Tax regime configurations with rates
const taxRegimes: Record<string, { regime: string; rate: number; flag: string }> = {
  PT: { regime: "NHR Regime", rate: 0.20, flag: "🇵🇹" },
  ES: { regime: "Beckham Law", rate: 0.24, flag: "🇪🇸" },
  AE: { regime: "Tax Free", rate: 0, flag: "🇦🇪" },
  SG: { regime: "Territorial Tax", rate: 0.22, flag: "🇸🇬" },
  MT: { regime: "Global Residence", rate: 0.15, flag: "🇲🇹" },
  CY: { regime: "Non-Dom Regime", rate: 0.125, flag: "🇨🇾" },
};

const countryNames: Record<string, string> = {
  PT: "Portugal",
  ES: "Spain",
  AE: "United Arab Emirates",
  SG: "Singapore",
  MT: "Malta",
  CY: "Cyprus",
};

// US federal tax brackets (simplified)
const calculateUSTax = (income: number): number => {
  if (income <= 11000) return income * 0.10;
  if (income <= 44725) return 1100 + (income - 11000) * 0.12;
  if (income <= 95375) return 5147 + (income - 44725) * 0.22;
  if (income <= 183000) return 16290 + (income - 95375) * 0.24;
  if (income <= 231250) return 37104 + (income - 183000) * 0.32;
  return 52832 + (income - 231250) * 0.35;
};

const TaxEstimator = () => {
  const { user } = useAuth();
  const [totalIncome, setTotalIncome] = useState(0);
  const [residencyDays, setResidencyDays] = useState<Record<string, number>>({});
  const [scenarios, setScenarios] = useState<TaxScenario[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch income sources
      const { data: incomeData } = await supabase
        .from("income_sources")
        .select("amount, currency");

      // Fetch countries for residency
      const { data: countryData } = await supabase
        .from("countries")
        .select("code, days_spent");

      // Calculate total income (convert to USD roughly)
      const currencyRates: Record<string, number> = { USD: 1, EUR: 1.08, GBP: 1.27 };
      const income = (incomeData || []).reduce((sum, src) => {
        const rate = currencyRates[src.currency] || 1;
        return sum + Number(src.amount) * rate;
      }, 0);
      setTotalIncome(income);

      // Map residency days by country code
      const days: Record<string, number> = {};
      (countryData || []).forEach((c) => {
        days[c.code] = c.days_spent;
      });
      setResidencyDays(days);

      // Generate tax scenarios
      generateScenarios(income);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateScenarios = (income: number) => {
    if (income === 0) {
      setScenarios([]);
      return;
    }

    const usTax = calculateUSTax(income);
    
    const scenarioList: TaxScenario[] = Object.entries(taxRegimes)
      .map(([code, config]) => {
        const estimatedTax = income * config.rate;
        const effectiveRate = config.rate * 100;
        const savings = usTax - estimatedTax;

        return {
          country: countryNames[code] || code,
          flag: config.flag,
          regime: config.regime,
          estimatedTax: `$${estimatedTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
          effectiveRate: `${effectiveRate.toFixed(1)}%`,
          savings: `$${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
          highlight: false,
          rawSavings: savings,
        };
      })
      .sort((a, b) => (b as any).rawSavings - (a as any).rawSavings)
      .slice(0, 3)
      .map((s, idx) => ({ ...s, highlight: idx === 0 }));

    setScenarios(scenarioList);
  };

  if (!user) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "500ms" }}>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Sign in to see tax optimization scenarios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Tax Optimization</h3>
            <p className="text-sm text-muted-foreground">
              {totalIncome > 0 
                ? `Based on $${totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })} annual income`
                : "Add income sources to see estimates"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary" onClick={fetchData} disabled={loading}>
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Run Analysis"}
          {!loading && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Add income sources to generate tax optimization scenarios</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scenarios.map((scenario) => (
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
      )}

      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-foreground">Pro Tip</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {Object.keys(residencyDays).length > 0 
            ? `You're tracking ${Object.keys(residencyDays).length} countries. Ensure you stay under 183 days to avoid tax residency issues.`
            : "Track your residency days in different countries to optimize your tax situation legally."}
        </p>
      </div>
    </div>
  );
};

export default TaxEstimator;
