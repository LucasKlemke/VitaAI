import { atom } from 'jotai';

interface Macronutrients {
  calories: number;
  protein: number;
  carbohydrates: number;
  total_carbs: number;
  dietary_fiber: number;
  net_carbs: number;
  total_fat: number;
  saturated_fat: number;
  trans_fat: number;
  monounsaturated_fat: number;
  polyunsaturated_fat: number;
  cholesterol: number;
  sodium: number;
  sugar: number;
  added_sugar: number;
}

interface Micronutrients {
  vitamin_a: number;
  vitamin_c: number;
  vitamin_d: number;
  vitamin_e: number;
  vitamin_k: number;
  vitamin_b1_thiamine: number;
  vitamin_b2_riboflavin: number;
  vitamin_b3_niacin: number;
  vitamin_b5_pantothenic_acid: number;
  vitamin_b6_pyridoxine: number;
  vitamin_b7_biotin: number;
  vitamin_b9_folate: number;
  vitamin_b12_cobalamin: number;
  calcium: number;
  iron: number;
  magnesium: number;
  phosphorus: number;
  potassium: number;
  zinc: number;
  copper: number;
  manganese: number;
  selenium: number;
  iodine: number;
  chromium: number;
  molybdenum: number;
}

interface FoodAnalysis {
  food_name: string;
  description: string;
  food_category: string;
  portion_size: number;
  portion_description: string;
  confidence_score: number;
  macronutrients: Macronutrients;
  micronutrients: Micronutrients;
  health_benefits: string[];
  image?: string;
}

export const analysisAtom = atom<FoodAnalysis | null>(null);

// Atom to trigger refresh of dashboard data
export const refreshTriggerAtom = atom(0);

// User profile atom to cache user data globally
export const userProfileAtom = atom<any>(null);

// Atom to track if user profile is being loaded
export const userProfileLoadingAtom = atom(false);