import { useState, useEffect } from "react";
import { TrendingUp, Globe, DollarSign, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DashboardSummary = () => {
  const { user } = useAuth();
  const [totalIncome, setTotalIncome] = useState(0);
  const [daysAbroad, setDaysAbroad] = useState(0);
  const [taxSavings, setTaxSavings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSummaryData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSummaryData = async () => {
    try {
      // Fetch income sources
      const { data: incomeData } = await supabase
        .from('income_sources')
        .select('amount, currency')
        .eq('user_id', user!.id);

      // Fetch countries
      const { data: countriesData } = await supabase
        .from('countries')
        .select('days_spent')
        .eq('user_id', user!.id);

      // Calculate total income (simplified - assumes USD)
      const total = incomeData?.reduce((sum, source) => {
        let amount = Number(source.amount);
        if (source.currency === 'EUR') amount *= 1.08;
        if (source.currency === 'GBP') amount *= 1.27;
        return sum + amount;
      }, 0) || 0;

      // Calculate total days abroad
      const days = countriesData?.reduce((sum, country) => sum + country.days_spent, 0) || 0;

      // Calculate potential tax savings (simplified estimate)
      const usRate = 0.32;
      const optimizedRate = 0.15;
      const savings = total * (usRate - optimizedRate);

      setTotalIncome(total);
      setDaysAbroad(days);
      setTaxSavings(savings);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Your Financial Snapshot</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Income (YTD)</p>
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalIncome)}</p>
            )}
          </div>
        </div>

        {/* Tax Savings Potential */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Potential Tax Savings</p>
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold text-primary">{formatCurrency(taxSavings)}</p>
            )}
          </div>
        </div>

        {/* Days Abroad */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Days Abroad</p>
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{daysAbroad} <span className="text-sm font-normal text-muted-foreground">days</span></p>
            )}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      {!loading && daysAbroad > 0 && (
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Progress to 183-day threshold</span>
            <span className="text-sm font-medium text-foreground">{Math.min(Math.round((daysAbroad / 183) * 100), 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((daysAbroad / 183) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {daysAbroad >= 183 
              ? "You've exceeded the typical tax residency threshold" 
              : `${183 - daysAbroad} more days to reach the 183-day threshold`}
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardSummary;
