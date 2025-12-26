import { Check, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const plans = [
  {
    name: "Explorer",
    price: "$29",
    period: "/month",
    description: "Perfect for nomads just starting out",
    features: [
      "Multi-currency income tracking",
      "Residency day tracker",
      "Basic tax estimations",
      "Document vault (5GB)",
      "Email support",
    ],
    cta: "Start Free Trial",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "For serious nomads optimizing their taxes",
    features: [
      "Everything in Explorer",
      "What-if scenario planning",
      "Expert marketplace access",
      "Document vault (25GB)",
      "Priority support",
      "Tax optimization alerts",
      "Multi-entity tracking",
    ],
    cta: "Start Free Trial",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For agencies and large remote teams",
    features: [
      "Everything in Professional",
      "Unlimited document storage",
      "Team management",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Path to Tax Freedom
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`relative glass-card rounded-2xl p-6 animate-slide-up ${
                plan.popular ? "ring-2 ring-primary shadow-lg shadow-primary/10" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-primary text-xs font-medium text-primary-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="mt-0.5 p-1 rounded-full bg-primary/10">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.variant === "hero" ? "hero" : "heroOutline"} 
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Prices in USD. Cancel anytime. Questions?{" "}
          <a href="#" className="text-primary hover:underline">Talk to us</a>
        </p>
      </div>
    </section>
  );
};

export default Pricing;
