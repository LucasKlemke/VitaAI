import { supabase } from '../supabase';

// Function to get user's daily nutrition summary
export const getDailyNutritionSummary = async (userId: string, date: string) => {
  try {
    const { data, error } = await supabase
      .from('food_entries')
      .select(`
        *,
        macronutrients(*)
      `)
      .eq('user_id', userId)
      .eq('date', date);

    if (error) {
      console.error('Error fetching daily nutrition:', error);
      throw error;
    }

    // Calculate totals
    const totals = data.reduce((acc, entry) => {
      const macros = entry.macronutrients[0];
      if (macros) {
        acc.calories += macros.calories || 0;
        acc.protein += macros.protein || 0;
        acc.carbs += macros.carbohydrates || 0;
        acc.fat += macros.total_fat || 0;
        acc.fiber += macros.dietary_fiber || 0;
      }
      return acc;
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      meals: data.length
    });

    return totals;
  } catch (error) {
    console.error('Failed to fetch daily nutrition summary:', error);
    throw error;
  }
};
