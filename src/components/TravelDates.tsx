import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { CalendarIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TravelDate {
  id: string;
  country_id: string;
  start_date: string;
  end_date: string;
}

interface TravelDatesProps {
  countryId: string;
  countryName: string;
  onDaysUpdate: (totalDays: number) => void;
}

const TravelDates = ({ countryId, countryName, onDaysUpdate }: TravelDatesProps) => {
  const { user } = useAuth();
  const [travelDates, setTravelDates] = useState<TravelDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStartDate, setNewStartDate] = useState<Date | undefined>();
  const [newEndDate, setNewEndDate] = useState<Date | undefined>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && countryId) {
      fetchTravelDates();
    }
  }, [user, countryId]);

  const fetchTravelDates = async () => {
    const { data, error } = await supabase
      .from("travel_dates")
      .select("*")
      .eq("country_id", countryId)
      .order("start_date", { ascending: false });

    if (error) {
      toast.error("Failed to load travel dates");
    } else {
      setTravelDates(data || []);
      calculateTotalDays(data || []);
    }
    setLoading(false);
  };

  const calculateTotalDays = (dates: TravelDate[]) => {
    const total = dates.reduce((sum, trip) => {
      const days = differenceInDays(new Date(trip.end_date), new Date(trip.start_date)) + 1;
      return sum + days;
    }, 0);
    onDaysUpdate(total);
  };

  const addTravelDate = async () => {
    if (!user || !newStartDate || !newEndDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (newEndDate < newStartDate) {
      toast.error("End date must be after start date");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("travel_dates").insert({
      user_id: user.id,
      country_id: countryId,
      start_date: format(newStartDate, "yyyy-MM-dd"),
      end_date: format(newEndDate, "yyyy-MM-dd"),
    });

    if (error) {
      toast.error("Failed to add travel dates");
    } else {
      toast.success("Travel dates added");
      setNewStartDate(undefined);
      setNewEndDate(undefined);
      setShowAddForm(false);
      fetchTravelDates();
    }
    setSaving(false);
  };

  const deleteTravelDate = async (id: string) => {
    const { error } = await supabase.from("travel_dates").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Travel dates removed");
      fetchTravelDates();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mt-2 pl-8 space-y-2">
      {travelDates.map((trip) => {
        const days = differenceInDays(new Date(trip.end_date), new Date(trip.start_date)) + 1;
        return (
          <div key={trip.id} className="flex items-center gap-2 text-sm text-muted-foreground group">
            <CalendarIcon className="w-3 h-3" />
            <span>
              {format(new Date(trip.start_date), "MMM d, yyyy")} - {format(new Date(trip.end_date), "MMM d, yyyy")}
            </span>
            <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
              {days} day{days !== 1 ? "s" : ""}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTravelDate(trip.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        );
      })}

      {showAddForm ? (
        <div className="flex items-center gap-2 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 justify-start text-left font-normal",
                  !newStartDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {newStartDate ? format(newStartDate, "MMM d, yyyy") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={newStartDate}
                onSelect={setNewStartDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground">to</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 justify-start text-left font-normal",
                  !newEndDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {newEndDate ? format(newEndDate, "MMM d, yyyy") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={newEndDate}
                onSelect={setNewEndDate}
                disabled={(date) => newStartDate ? date < newStartDate : false}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Button size="sm" onClick={addTravelDate} disabled={saving} className="h-8">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowAddForm(false);
              setNewStartDate(undefined);
              setNewEndDate(undefined);
            }}
            className="h-8"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add travel dates
        </Button>
      )}
    </div>
  );
};

export default TravelDates;
