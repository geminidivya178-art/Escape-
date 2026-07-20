export type BudgetLevel = 'budget' | 'mid-range' | 'luxury';

export interface EscapePreferences {
  days: number;
  interests: string[];
  budgetLevel: BudgetLevel;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  morning: {
    activity: string;
    description: string;
  };
  afternoon: {
    activity: string;
    description: string;
  };
  evening: {
    activity: string;
    description: string;
  };
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  dayBudget: string;
}

export interface EscapeResult {
  destination: string;
  country: string;
  tagline: string;
  whyThisDestination: string;
  bestTimeToGo: string;
  packingList: string[];
  costEstimates: {
    flights: string;
    accommodation: string;
    dailyFoodActivity: string;
    totalEstimated: string;
  };
  itinerary: DayPlan[];
  localPhrases: { phrase: string; translation: string; pronunciation: string }[];
}
