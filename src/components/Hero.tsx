import { Button } from "./ui/button";
import Globe from "./Globe";
import { ArrowRight, Shield, Clock, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-[0.02]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Trusted by 12,000+ digital nomads</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-slide-up">
              <span className="text-foreground">Master Your</span>
              <br />
              <span className="gradient-text">Global Taxes</span>
              <br />
              <span className="text-foreground">Effortlessly</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
              Track income across currencies, monitor residency days, and discover optimal tax strategies. 
              Built for location-independent professionals who want clarity, not complexity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Button variant="hero" size="xl">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="heroOutline" size="xl">
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Bank-level Security</p>
                  <p className="text-xs text-muted-foreground">256-bit encryption</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Real-time Tracking</p>
                  <p className="text-xs text-muted-foreground">40+ countries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Globe */}
          <div className="relative flex justify-center items-center animate-fade-in" style={{ animationDelay: "400ms" }}>
            <Globe />
            
            {/* Floating Cards */}
            <div className="absolute top-10 -left-4 md:left-0 glass rounded-xl p-3 animate-float shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇵🇹</span>
                <div>
                  <p className="text-xs text-muted-foreground">Current Location</p>
                  <p className="text-sm font-medium text-foreground">Lisbon, Portugal</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-20 -right-4 md:right-0 glass rounded-xl p-3 animate-float shadow-lg" style={{ animationDelay: "2s" }}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
                  <span className="text-lg font-bold text-accent-foreground">87</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Days in Portugal</p>
                  <p className="text-sm font-medium text-primary">96 days remaining</p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-8 md:right-4 glass rounded-xl p-3 animate-float shadow-lg" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Potential Savings</p>
                  <p className="text-sm font-bold gradient-text-accent">$14,760/year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
