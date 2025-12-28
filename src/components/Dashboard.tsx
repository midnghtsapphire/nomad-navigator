import { Wallet, Calendar, FileText, Globe } from "lucide-react";
import StatCard from "./StatCard";
import IncomeOverview from "./IncomeOverview";
import ResidencyTracker from "./ResidencyTracker";
import TaxEstimator from "./TaxEstimator";
import DashboardSummary from "./DashboardSummary";
import DocumentStorage from "./DocumentStorage";

const Dashboard = () => {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-fade-in">
            Dashboard Preview
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-slide-up">
            Everything You Need in One Place
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
            Real-time insights into your global finances. Track, analyze, and optimize your tax situation across borders.
          </p>
        </div>

        {/* Dashboard Summary */}
        <DashboardSummary />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Income (YTD)"
            value="$93,800"
            change="+12.5%"
            changeType="positive"
            icon={<Wallet className="w-5 h-5" />}
            delay={0}
          />
          <StatCard
            title="Days Abroad"
            value="222"
            change="143 remaining"
            changeType="neutral"
            icon={<Calendar className="w-5 h-5" />}
            delay={100}
          />
          <StatCard
            title="Documents Stored"
            value="47"
            change="+3 this month"
            changeType="neutral"
            icon={<FileText className="w-5 h-5" />}
            delay={200}
          />
          <StatCard
            title="Countries Visited"
            value="8"
            change="4 tax treaties"
            changeType="positive"
            icon={<Globe className="w-5 h-5" />}
            delay={300}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <IncomeOverview />
          <ResidencyTracker />
        </div>

        {/* Tax Estimator */}
        <div className="mt-6">
          <TaxEstimator />
        </div>

        {/* Document Storage */}
        <div className="mt-6">
          <DocumentStorage />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
