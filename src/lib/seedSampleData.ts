import { supabase } from '@/integrations/supabase/client';

const sampleCountries = [
  { name: 'Portugal', code: 'PT', flag: '🇵🇹', days_spent: 45, legal_limit: 183, color: '#22C55E' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸', days_spent: 30, legal_limit: 183, color: '#EF4444' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', days_spent: 60, legal_limit: 183, color: '#F59E0B' },
];

const sampleIncomeSources = [
  { name: 'Freelance Consulting', amount: 8500, currency: 'USD', month: 'Jan', source_type: 'freelance' },
  { name: 'Investment Dividends', amount: 2200, currency: 'USD', month: 'Feb', source_type: 'investment' },
  { name: 'Remote Work Salary', amount: 12000, currency: 'EUR', month: 'Mar', source_type: 'salary' },
  { name: 'Consulting Project', amount: 5000, currency: 'USD', month: 'Apr', source_type: 'freelance' },
];

export const seedSampleData = async (userId: string) => {
  try {
    // Insert sample countries
    const countriesWithUserId = sampleCountries.map(country => ({
      ...country,
      user_id: userId,
    }));
    
    await supabase.from('countries').insert(countriesWithUserId);

    // Insert sample income sources
    const incomeWithUserId = sampleIncomeSources.map(income => ({
      ...income,
      user_id: userId,
      year: new Date().getFullYear(),
    }));
    
    await supabase.from('income_sources').insert(incomeWithUserId);
  } catch (error) {
    console.error('Error seeding sample data:', error);
  }
};
