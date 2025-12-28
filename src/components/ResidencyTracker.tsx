import { useState, useEffect } from "react";
import { MapPin, Calendar, AlertTriangle, Plus, Trash2, Loader2, Pencil, X, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
  days_spent: number;
  legal_limit: number;
  color: string;
}

const ResidencyTracker = () => {
  const { user } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", code: "", flag: "", days_spent: 0, legal_limit: 183 });
  const [newCountry, setNewCountry] = useState({
    name: "",
    code: "",
    flag: "",
    days_spent: 0,
    legal_limit: 183,
    color: "#3B82F6"
  });

  useEffect(() => {
    if (user) {
      fetchCountries();
    } else {
      setCountries([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCountries = async () => {
    const { data, error } = await supabase
      .from("countries")
      .select("*")
      .order("days_spent", { ascending: false });

    if (error) {
      toast.error("Failed to load countries");
    } else {
      setCountries(data || []);
    }
    setLoading(false);
  };

  const addCountry = async () => {
    if (!user) {
      toast.error("Please sign in to add countries");
      return;
    }
    if (!newCountry.name.trim() || !newCountry.code.trim() || !newCountry.flag.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const { error } = await supabase.from("countries").insert({
      user_id: user.id,
      name: newCountry.name.trim(),
      code: newCountry.code.trim().toUpperCase(),
      flag: newCountry.flag.trim(),
      days_spent: newCountry.days_spent,
      legal_limit: newCountry.legal_limit,
      color: newCountry.color
    });

    if (error) {
      toast.error("Failed to add country");
    } else {
      toast.success("Country added");
      setNewCountry({ name: "", code: "", flag: "", days_spent: 0, legal_limit: 183, color: "#3B82F6" });
      setShowForm(false);
      fetchCountries();
    }
  };

  const updateDays = async (id: string, days: number) => {
    const { error } = await supabase
      .from("countries")
      .update({ days_spent: Math.max(0, days) })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update");
    } else {
      fetchCountries();
    }
  };

  const deleteCountry = async (id: string) => {
    const { error } = await supabase.from("countries").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Country removed");
      fetchCountries();
    }
  };

  const startEditing = (country: Country) => {
    setEditingId(country.id);
    setEditForm({
      name: country.name,
      code: country.code,
      flag: country.flag,
      days_spent: country.days_spent,
      legal_limit: country.legal_limit,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ name: "", code: "", flag: "", days_spent: 0, legal_limit: 183 });
  };

  const saveEdit = async () => {
    if (!editingId || !editForm.name.trim()) {
      toast.error("Please fill in the country name");
      return;
    }

    const { error } = await supabase
      .from("countries")
      .update({
        name: editForm.name.trim(),
        code: editForm.code.trim().toUpperCase(),
        flag: editForm.flag.trim(),
        days_spent: editForm.days_spent,
        legal_limit: editForm.legal_limit,
      })
      .eq("id", editingId);

    if (error) {
      toast.error("Failed to update country");
    } else {
      toast.success("Country updated");
      setEditingId(null);
      fetchCountries();
    }
  };

  const warningCountry = countries.find(c => (c.days_spent / c.legal_limit) * 100 > 70);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-slide-up flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10">
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Residency Tracker</h3>
            <p className="text-sm text-muted-foreground">Tax year {new Date().getFullYear()}</p>
          </div>
        </div>
        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="text-accent hover:text-accent"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 p-4 rounded-xl bg-secondary/50 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Country name"
              value={newCountry.name}
              onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
              maxLength={50}
            />
            <Input
              placeholder="Code (e.g., US)"
              value={newCountry.code}
              onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value })}
              maxLength={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              placeholder="Flag emoji"
              value={newCountry.flag}
              onChange={(e) => setNewCountry({ ...newCountry, flag: e.target.value })}
              maxLength={4}
            />
            <Input
              type="number"
              placeholder="Days"
              value={newCountry.days_spent}
              onChange={(e) => setNewCountry({ ...newCountry, days_spent: parseInt(e.target.value) || 0 })}
              min={0}
              max={365}
            />
            <Input
              type="number"
              placeholder="Limit"
              value={newCountry.legal_limit}
              onChange={(e) => setNewCountry({ ...newCountry, legal_limit: parseInt(e.target.value) || 183 })}
              min={1}
              max={365}
            />
          </div>
          <Button onClick={addCountry} className="w-full">
            Add Country
          </Button>
        </div>
      )}

      {!user ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Sign in to track your residency days
        </p>
      ) : countries.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No countries added yet. Click "Add" to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {countries.map((country, index) => {
            const percentage = (country.days_spent / country.legal_limit) * 100;
            const isWarning = percentage > 70;

            return (
              <div key={country.id} className="space-y-2 group">
                {editingId === country.id ? (
                  <div className="p-3 rounded-xl bg-secondary/50 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Country name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="h-8 text-sm"
                        maxLength={50}
                      />
                      <Input
                        placeholder="Code"
                        value={editForm.code}
                        onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                        className="h-8 text-sm"
                        maxLength={3}
                      />
                      <Input
                        placeholder="Flag"
                        value={editForm.flag}
                        onChange={(e) => setEditForm({ ...editForm, flag: e.target.value })}
                        className="h-8 text-sm"
                        maxLength={4}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Days"
                        value={editForm.days_spent}
                        onChange={(e) => setEditForm({ ...editForm, days_spent: parseInt(e.target.value) || 0 })}
                        className="h-8 text-sm flex-1"
                        min={0}
                        max={365}
                      />
                      <Input
                        type="number"
                        placeholder="Limit"
                        value={editForm.legal_limit}
                        onChange={(e) => setEditForm({ ...editForm, legal_limit: parseInt(e.target.value) || 183 })}
                        className="h-8 text-sm flex-1"
                        min={1}
                        max={365}
                      />
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={saveEdit}>
                        <Check className="w-4 h-4 text-primary" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditing}>
                        <X className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
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
                        <Input
                          type="number"
                          value={country.days_spent}
                          onChange={(e) => updateDays(country.id, parseInt(e.target.value) || 0)}
                          className="w-16 h-7 text-center p-1"
                          min={0}
                          max={365}
                        />
                        <span className="text-muted-foreground">/ {country.legal_limit} days</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(country)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCountry(country.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {warningCountry && (
        <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Tax Residency Alert</p>
              <p className="text-sm text-muted-foreground mt-1">
                You're approaching the {warningCountry.legal_limit}-day limit in {warningCountry.name}. Consider your travel plans to optimize tax residency.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidencyTracker;
