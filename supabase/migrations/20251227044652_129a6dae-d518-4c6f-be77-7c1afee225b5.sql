-- Create countries table for residency tracking
CREATE TABLE public.countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  flag TEXT NOT NULL,
  days_spent INTEGER NOT NULL DEFAULT 0,
  legal_limit INTEGER NOT NULL DEFAULT 183,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create income_sources table
CREATE TABLE public.income_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  source_type TEXT NOT NULL DEFAULT 'salary',
  month TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;

-- RLS policies for countries
CREATE POLICY "Users can view their own countries"
ON public.countries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own countries"
ON public.countries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own countries"
ON public.countries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own countries"
ON public.countries FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for income_sources
CREATE POLICY "Users can view their own income sources"
ON public.income_sources FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own income sources"
ON public.income_sources FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own income sources"
ON public.income_sources FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own income sources"
ON public.income_sources FOR DELETE
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_countries_updated_at
BEFORE UPDATE ON public.countries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_income_sources_updated_at
BEFORE UPDATE ON public.income_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();