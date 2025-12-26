import { TrendingUp, DollarSign, Euro, PoundSterling } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", usd: 8400, eur: 3200, gbp: 1800 },
  { month: "Feb", usd: 9200, eur: 2800, gbp: 2100 },
  { month: "Mar", usd: 7800, eur: 4100, gbp: 1600 },
  { month: "Apr", usd: 11200, eur: 3600, gbp: 2400 },
  { month: "May", usd: 9800, eur: 4800, gbp: 1900 },
  { month: "Jun", usd: 12400, eur: 3900, gbp: 2800 },
];

const currencies = [
  { name: "USD", value: "$58,800", icon: DollarSign, color: "hsl(173, 80%, 40%)" },
  { name: "EUR", value: "€22,400", icon: Euro, color: "hsl(38, 92%, 50%)" },
  { name: "GBP", value: "£12,600", icon: PoundSterling, color: "hsl(280, 70%, 50%)" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3 border border-border">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name.toUpperCase()}: {entry.name === "usd" ? "$" : entry.name === "eur" ? "€" : "£"}{entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const IncomeOverview = () => {
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
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {currencies.map((currency, index) => (
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

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
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
