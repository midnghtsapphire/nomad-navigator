-- Create a table for travel dates
CREATE TABLE public.travel_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Enable Row Level Security
ALTER TABLE public.travel_dates ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own travel dates" 
ON public.travel_dates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own travel dates" 
ON public.travel_dates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own travel dates" 
ON public.travel_dates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own travel dates" 
ON public.travel_dates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_travel_dates_updated_at
BEFORE UPDATE ON public.travel_dates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_travel_dates_country_id ON public.travel_dates(country_id);
CREATE INDEX idx_travel_dates_user_id ON public.travel_dates(user_id);