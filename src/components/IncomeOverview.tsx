import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Euro, PoundSterling, Plus, Trash2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type IncomeSource = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  month: string | null;
  year: number | null;
  source_type: string;
};

const currencyConfig = {
  USD: { icon: DollarSign, color: "hsl(173, 80%, 40%)", symbol: "$" },
  EUR: { icon: Euro, color: "hsl(38, 92%, 50%)", symbol: "€" },
  GBP: { icon: PoundSterling, color: "hsl(280, 70%, 50%)", symbol: "£" },
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3 border border-border">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name.toUpperCase()}: {currencyConfig[entry.name.toUpperCase() as keyof typeof currencyConfig]?.symbol || "$"}{entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const IncomeOverview = () => {
  const { user } = useAuth();
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIncome, setNewIncome] = useState({
    name: "",
    amount: "",
    currency: "USD",
    month: "",
    source_type: "salary",
  });

  useEffect(() => {
    if (user) {
      fetchIncomeSources();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchIncomeSources = async () => {
    try {
      const { data, error } = await supabase
        .from("income_sources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIncomeSources(data || []);
    } catch (error: any) {
      toast.error("Failed to load income data");
    } finally {
      setLoading(false);
    }
  };

  const addIncomeSource = async () => {
    if (!user || !newIncome.name || !newIncome.amount) {
      toast.error("Please fill in name and amount");
      return;
    }

    try {
      const { error } = await supabase.from("income_sources").insert({
        user_id: user.id,
        name: newIncome.name,
        amount: parseFloat(newIncome.amount),
        currency: newIncome.currency,
        month: newIncome.month || null,
        year: new Date().getFullYear(),
        source_type: newIncome.source_type,
      });

      if (error) throw error;
      toast.success("Income source added");
      setNewIncome({ name: "", amount: "", currency: "USD", month: "", source_type: "salary" });
      setShowAddForm(false);
      fetchIncomeSources();
    } catch (error: any) {
      toast.error("Failed to add income source");
    }
  };

  const deleteIncomeSource = async (id: string) => {
    try {
      const { error } = await supabase.from("income_sources").delete().eq("id", id);
      if (error) throw error;
      toast.success("Income source deleted");
      fetchIncomeSources();
    } catch (error: any) {
      toast.error("Failed to delete income source");
    }
  };

  // Calculate totals by currency
  const currencyTotals = incomeSources.reduce((acc, source) => {
    acc[source.currency] = (acc[source.currency] || 0) + Number(source.amount);
    return acc;
  }, {} as Record<string, number>);

  // Prepare chart data by month
  const chartData = months.map((month) => {
    const monthData: Record<string, any> = { month };
    const monthSources = incomeSources.filter((s) => s.month === month);
    
    Object.keys(currencyConfig).forEach((currency) => {
      monthData[currency.toLowerCase()] = monthSources
        .filter((s) => s.currency === currency)
        .reduce((sum, s) => sum + Number(s.amount), 0);
    });
    
    return monthData;
  });

  const currencies = Object.entries(currencyConfig).map(([name, config]) => ({
    name,
    value: `${config.symbol}${(currencyTotals[name] || 0).toLocaleString()}`,
    icon: config.icon,
    color: config.color,
  }));

  if (!user) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Sign in to track your income</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Income Overview</h3>
            <p className="text-sm text-muted-foreground">Multi-currency tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            {currencies.map((currency) => (
              <div 
                key={currency.name}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary"
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currency.color }} />
                <span className="text-xs text-muted-foreground">{currency.name}</span>
              </div>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 rounded-xl bg-secondary/50 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Source name"
              value={newIncome.name}
              onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newIncome.amount}
              onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Select value={newIncome.currency} onValueChange={(v) => setNewIncome({ ...newIncome, currency: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newIncome.month} onValueChange={(v) => setNewIncome({ ...newIncome, month: v })}>
              <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={newIncome.source_type} onValueChange={(v) => setNewIncome({ ...newIncome, source_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addIncomeSource} className="w-full">Add Income Source</Button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {currencies.map((currency) => (
          <div 
            key={currency.name}
            className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <currency.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{currency.name}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: currency.color }}>{currency.value}</p>
          </div>
        ))}
      </div>

      {incomeSources.length > 0 && (
        <div className="mb-6 space-y-2 max-h-32 overflow-y-auto">
          {incomeSources.slice(0, 5).map((source) => (
            <div key={source.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{source.name}</span>
                <span className="text-xs text-muted-foreground">{source.month || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: currencyConfig[source.currency as keyof typeof currencyConfig]?.color }}>
                  {currencyConfig[source.currency as keyof typeof currencyConfig]?.symbol}{Number(source.amount).toLocaleString()}
                </span>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => deleteIncomeSource(source.id)}>
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="usdGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="eurGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gbpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(280, 70%, 50%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(280, 70%, 50%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="usd" 
              stroke="hsl(173, 80%, 40%)" 
              strokeWidth={2}
              fill="url(#usdGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="eur" 
              stroke="hsl(38, 92%, 50%)" 
              strokeWidth={2}
              fill="url(#eurGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="gbp" 
              stroke="hsl(280, 70%, 50%)" 
              strokeWidth={2}
              fill="url(#gbpGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeOverview;
