import { 
  CreditCard, 
  MapPin, 
  Calculator, 
  FolderLock, 
  Users, 
  Bell,
  ArrowRight
} from "lucide-react";
import { Button } from "./ui/button";

const features = [
  {
    icon: CreditCard,
    title: "Multi-Currency Tracking",
    description: "Connect bank accounts and cards from 40+ countries. Automatic currency conversion and categorization.",
    color: "primary",
  },
  {
    icon: MapPin,
    title: "Residency Day Tracker",
    description: "GPS-powered location tracking with manual override. Never exceed tax residency thresholds again.",
    color: "accent",
  },
  {
    icon: Calculator,
    title: "Tax Estimation Engine",
    description: "Real-time tax liability calculations based on your income, location, and applicable treaties.",
    color: "primary",
  },
  {
    icon: FolderLock,
    title: "Secure Document Vault",
    description: "Store visas, receipts, and tax forms with bank-level encryption. Always accessible, never lost.",
    color: "accent",
  },
  {
    icon: Users,
    title: "Expert Marketplace",
    description: "Connect with vetted accountants and lawyers specializing in digital nomad tax law.",
    color: "primary",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified before you approach residency limits or when tax optimization opportunities arise.",
    color: "accent",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for the Location-Independent Lifestyle
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature designed with digital nomads in mind. From Bali to Barcelona, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex p-3 rounded-xl mb-4 ${
                feature.color === "primary" ? "bg-primary/10" : "bg-accent/10"
              }`}>
                <feature.icon className={`w-6 h-6 ${
                  feature.color === "primary" ? "text-primary" : "text-accent"
                }`} />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground mb-4">
                {feature.description}
              </p>
              
              <Button variant="ghost" size="sm" className="text-primary p-0 h-auto font-medium group-hover:gap-2 transition-all">
                Learn more
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
