import { MapPin, Calendar, AlertTriangle } from "lucide-react";

const countries = [
  { name: "Portugal", code: "PT", days: 87, limit: 183, flag: "🇵🇹", color: "hsl(173, 80%, 40%)" },
  { name: "Spain", code: "ES", days: 45, limit: 183, flag: "🇪🇸", color: "hsl(38, 92%, 50%)" },
  { name: "Thailand", code: "TH", days: 62, limit: 180, flag: "🇹🇭", color: "hsl(280, 70%, 50%)" },
  { name: "Mexico", code: "MX", days: 28, limit: 180, flag: "🇲🇽", color: "hsl(140, 70%, 40%)" },
];

const ResidencyTracker = () => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-accent/10">
          <MapPin className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Residency Tracker</h3>
          <p className="text-sm text-muted-foreground">Tax year 2024</p>
        </div>
      </div>

      <div className="space-y-4">
        {countries.map((country, index) => {
          const percentage = (country.days / country.limit) * 100;
          const isWarning = percentage > 70;
          
          return (
            <div key={country.code} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{country.flag}</span>
                  <span className="font-medium text-foreground">{country.name}</span>
                  {isWarning && (
                    <AlertTriangle className="w-4 h-4 text-accent animate-pulse" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{country.days}</span>
                  <span className="text-muted-foreground">/ {country.limit} days</span>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${Math.min(percentage, 100)}%`,
                    background: isWarning 
                      ? "linear-gradient(90deg, hsl(38, 92%, 50%), hsl(0, 84%, 60%))"
                      : `linear-gradient(90deg, ${country.color}, ${country.color}80)`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Tax Residency Alert</p>
            <p className="text-sm text-muted-foreground mt-1">
              You're approaching the 183-day limit in Portugal. Consider your travel plans to optimize tax residency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidencyTracker;
