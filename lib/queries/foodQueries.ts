import { supabase } from '../supabase';

// Function to save food entry with all nutritional data
export const saveFoodEntry = async (
  userId: string,
  foodAnalysis: any,
  imageUrl?: string,
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'snack',
  useServerClient = false
) => {
  try {
    const client =  supabase;
    
    // First, create the food entry
    const { data: foodEntry, error: foodError } = await client
      .from('food_entries')
      .insert({
        user_id: userId,
        date: new Date().toISOString().split('T')[0], // Today's date
        meal_type: mealType,
        food_name: foodAnalysis.food_name,
        description: foodAnalysis.description,
        image_url: imageUrl,
        portion_size: foodAnalysis.portion_size,
        portion_description: foodAnalysis.portion_description,
        confidence_score: foodAnalysis.confidence_score
      })
      .select()
      .single();

    if (foodError) {
      console.error('Error creating food entry:', foodError);
      throw foodError;
    }

    // Then, create the macronutrients entry
    const { error: macroError } = await client
      .from('macronutrients')
      .insert({
        food_entry_id: foodEntry.id,
        calories: foodAnalysis.macronutrients.calories,
        protein: foodAnalysis.macronutrients.protein,
        carbohydrates: foodAnalysis.macronutrients.carbohydrates,
        total_carbs: foodAnalysis.macronutrients.total_carbs,
        dietary_fiber: foodAnalysis.macronutrients.dietary_fiber,
        net_carbs: foodAnalysis.macronutrients.net_carbs,
        total_fat: foodAnalysis.macronutrients.total_fat,
        saturated_fat: foodAnalysis.macronutrients.saturated_fat,
        trans_fat: foodAnalysis.macronutrients.trans_fat,
        monounsaturated_fat: foodAnalysis.macronutrients.monounsaturated_fat,
        polyunsaturated_fat: foodAnalysis.macronutrients.polyunsaturated_fat,
        cholesterol: foodAnalysis.macronutrients.cholesterol,
        sodium: foodAnalysis.macronutrients.sodium,
        sugar: foodAnalysis.macronutrients.sugar,
        added_sugar: foodAnalysis.macronutrients.added_sugar
      });

    if (macroError) {
      console.error('Error creating macronutrients:', macroError);
      throw macroError;
    }

    // Finally, create the micronutrients entry
    const { error: microError } = await client
      .from('micronutrients')
      .insert({
        food_entry_id: foodEntry.id,
        vitamin_a: foodAnalysis.micronutrients.vitamin_a,
        vitamin_c: foodAnalysis.micronutrients.vitamin_c,
        vitamin_d: foodAnalysis.micronutrients.vitamin_d,
        vitamin_e: foodAnalysis.micronutrients.vitamin_e,
        vitamin_k: foodAnalysis.micronutrients.vitamin_k,
        vitamin_b1_thiamine: foodAnalysis.micronutrients.vitamin_b1_thiamine,
        vitamin_b2_riboflavin: foodAnalysis.micronutrients.vitamin_b2_riboflavin,
        vitamin_b3_niacin: foodAnalysis.micronutrients.vitamin_b3_niacin,
        vitamin_b5_pantothenic_acid: foodAnalysis.micronutrients.vitamin_b5_pantothenic_acid,
        vitamin_b6_pyridoxine: foodAnalysis.micronutrients.vitamin_b6_pyridoxine,
        vitamin_b7_biotin: foodAnalysis.micronutrients.vitamin_b7_biotin,
        vitamin_b9_folate: foodAnalysis.micronutrients.vitamin_b9_folate,
        vitamin_b12_cobalamin: foodAnalysis.micronutrients.vitamin_b12_cobalamin,
        calcium: foodAnalysis.micronutrients.calcium,
        iron: foodAnalysis.micronutrients.iron,
        magnesium: foodAnalysis.micronutrients.magnesium,
        phosphorus: foodAnalysis.micronutrients.phosphorus,
        potassium: foodAnalysis.micronutrients.potassium,
        zinc: foodAnalysis.micronutrients.zinc,
        copper: foodAnalysis.micronutrients.copper,
        manganese: foodAnalysis.micronutrients.manganese,
        selenium: foodAnalysis.micronutrients.selenium,
        iodine: foodAnalysis.micronutrients.iodine,
        chromium: foodAnalysis.micronutrients.chromium,
        molybdenum: foodAnalysis.micronutrients.molybdenum
      });

    if (microError) {
      console.error('Error creating micronutrients:', microError);
      throw microError;
    }

    return foodEntry;
  } catch (error) {
    console.error('Failed to save food entry:', error);
    throw error;
  }
};

// Function to get user's food entries for a specific date
export const getFoodEntriesByDate = async (userId: string, date: string) => {
  try {
    const { data, error } = await supabase
      .from('food_entries')
      .select(`
        *,
        macronutrients(*),
        micronutrients(*)
      `)
      .eq('user_id', userId)
      .eq('date', date)
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching food entries:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch food entries:', error);
    throw error;
  }
};

// Function to get user's food entries for a date range (for calendar)
export const getFoodEntriesByDateRange = async (userId: string, startDate: string, endDate: string) => {
  try {
    const { data, error } = await supabase
      .from('food_entries')
      .select(`
        id,
        date,
        meal_type,
        food_name,
        portion_size,
        portion_description,
        macronutrients(
          calories,
          protein,
          carbohydrates,
          total_fat
        )
      `)
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching food entries by date range:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch food entries by date range:', error);
    throw error;
  }
};

// Function to get aggregated daily nutrition data for calendar
export const getDailyNutritionSummary = async (userId: string, startDate: string, endDate: string) => {
  try {
    const { data, error } = await supabase
      .from('food_entries')
      .select(`
        id,
        date,
        meal_type,
        food_name,
        macronutrients!inner(
          calories,
          protein,
          carbohydrates,
          total_fat
        )
      `)
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching daily nutrition summary:', error);
      throw error;
    }

    // Aggregate data by date
    const aggregatedData: { [key: string]: any } = {};
    
    data?.forEach(entry => {
      const date = entry.date;
      
      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          date,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          meals: 0
        };
      }
      
      if (entry.macronutrients && entry.macronutrients.length > 0) {
        const macro = entry.macronutrients[0]; // Get first macronutrient entry
        aggregatedData[date].calories += Number(macro.calories) || 0;
        aggregatedData[date].protein += Number(macro.protein) || 0;
        aggregatedData[date].carbs += Number(macro.carbohydrates) || 0;
        aggregatedData[date].fat += Number(macro.total_fat) || 0;
        aggregatedData[date].meals += 1;
      }
    });

    return Object.values(aggregatedData);
  } catch (error) {
    console.error('Failed to fetch daily nutrition summary:', error);
    throw error;
  }
};

// Alternative approach: Get data separately and join manually
export const getDailyNutritionSummaryAlternative = async (userId: string, startDate: string, endDate: string) => {
  try {
    // Get food entries first
    const { data: foodEntries, error: foodError } = await supabase
      .from('food_entries')
      .select('id, date, meal_type, food_name')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (foodError) {
      console.error('Error fetching food entries:', foodError);
      throw foodError;
    }

    if (!foodEntries || foodEntries.length === 0) {
      return [];
    }

    // Get macronutrients for all food entries
    const foodEntryIds = foodEntries.map(entry => entry.id);
    const { data: macronutrients, error: macroError } = await supabase
      .from('macronutrients')
      .select('food_entry_id, calories, protein, carbohydrates, total_fat')
      .in('food_entry_id', foodEntryIds);

    if (macroError) {
      console.error('Error fetching macronutrients:', macroError);
      throw macroError;
    }

    // Create a map of food_entry_id to macronutrients
    const macroMap = new Map();
    macronutrients?.forEach(macro => {
      macroMap.set(macro.food_entry_id, macro);
    });

    // Aggregate data by date
    const aggregatedData: { [key: string]: any } = {};
    
    foodEntries.forEach(entry => {
      const date = entry.date;
      const macro = macroMap.get(entry.id);
      
      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          date,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          meals: 0
        };
      }
      
      if (macro) {
        aggregatedData[date].calories += Number(macro.calories) || 0;
        aggregatedData[date].protein += Number(macro.protein) || 0;
        aggregatedData[date].carbs += Number(macro.carbohydrates) || 0;
        aggregatedData[date].fat += Number(macro.total_fat) || 0;
        aggregatedData[date].meals += 1;
      }
    });

    return Object.values(aggregatedData);
  } catch (error) {
    console.error('Failed to fetch daily nutrition summary (alternative):', error);
    throw error;
  }
};

// Function to get today's food entries for recent entries section
export const getTodayFoodEntries = async (userId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('food_entries')
      .select(`
        id,
        food_name,
        meal_type,
        time,
        macronutrients(
          calories,
          protein,
          carbohydrates,
          total_fat
        )
      `)
      .eq('user_id', userId)
      .eq('date', today)
      .order('time', { ascending: false }); // Most recent first

    if (error) {
      console.error('Error fetching today food entries:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch today food entries:', error);
    throw error;
  }
};

// Function to get a single food entry with full nutritional data
export const getFoodEntryById = async (entryId: string) => {
  try {
    const { data, error } = await supabase
      .from('food_entries')
      .select(`
        *,
        macronutrients(*),
        micronutrients(*)
      `)
      .eq('id', entryId)
      .single();

    if (error) {
      console.error('Error fetching food entry:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch food entry:', error);
    throw error;
  }
};

// Function to convert food entry to analysis format
export const convertFoodEntryToAnalysis = (foodEntry: any) => {
  const macro = foodEntry.macronutrients?.[0];
  const micro = foodEntry.micronutrients?.[0];

  return {
    food_name: foodEntry.food_name,
    description: foodEntry.description || '',
    food_category: 'Food', // Default category
    portion_size: foodEntry.portion_size || 1,
    portion_description: foodEntry.portion_description || '1 serving',
    confidence_score: foodEntry.confidence_score || 0.8,
    image: foodEntry.image_url,
    macronutrients: {
      calories: macro?.calories || 0,
      protein: macro?.protein || 0,
      carbohydrates: macro?.carbohydrates || 0,
      total_carbs: macro?.total_carbs || 0,
      dietary_fiber: macro?.dietary_fiber || 0,
      net_carbs: macro?.net_carbs || 0,
      total_fat: macro?.total_fat || 0,
      saturated_fat: macro?.saturated_fat || 0,
      trans_fat: macro?.trans_fat || 0,
      monounsaturated_fat: macro?.monounsaturated_fat || 0,
      polyunsaturated_fat: macro?.polyunsaturated_fat || 0,
      cholesterol: macro?.cholesterol || 0,
      sodium: macro?.sodium || 0,
      sugar: macro?.sugar || 0,
      added_sugar: macro?.added_sugar || 0
    },
    micronutrients: {
      vitamin_a: micro?.vitamin_a || 0,
      vitamin_c: micro?.vitamin_c || 0,
      vitamin_d: micro?.vitamin_d || 0,
      vitamin_e: micro?.vitamin_e || 0,
      vitamin_k: micro?.vitamin_k || 0,
      vitamin_b1_thiamine: micro?.vitamin_b1_thiamine || 0,
      vitamin_b2_riboflavin: micro?.vitamin_b2_riboflavin || 0,
      vitamin_b3_niacin: micro?.vitamin_b3_niacin || 0,
      vitamin_b5_pantothenic_acid: micro?.vitamin_b5_pantothenic_acid || 0,
      vitamin_b6_pyridoxine: micro?.vitamin_b6_pyridoxine || 0,
      vitamin_b7_biotin: micro?.vitamin_b7_biotin || 0,
      vitamin_b9_folate: micro?.vitamin_b9_folate || 0,
      vitamin_b12_cobalamin: micro?.vitamin_b12_cobalamin || 0,
      calcium: micro?.calcium || 0,
      iron: micro?.iron || 0,
      magnesium: micro?.magnesium || 0,
      phosphorus: micro?.phosphorus || 0,
      potassium: micro?.potassium || 0,
      zinc: micro?.zinc || 0,
      copper: micro?.copper || 0,
      manganese: micro?.manganese || 0,
      selenium: micro?.selenium || 0,
      iodine: micro?.iodine || 0,
      chromium: micro?.chromium || 0,
      molybdenum: micro?.molybdenum || 0
    },
    health_benefits: [] // Default empty array
  };
};

// Function to get today's nutrition summary for dashboard
export const getTodayNutritionSummary = async (userId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get food entries for today
    const { data: foodEntries, error: foodError } = await supabase
      .from('food_entries')
      .select('id, meal_type, food_name')
      .eq('user_id', userId)
      .eq('date', today)
      .order('time', { ascending: true });

    if (foodError) {
      console.error('Error fetching today food entries:', foodError);
      throw foodError;
    }

    if (!foodEntries || foodEntries.length === 0) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        meals: 0
      };
    }

    // Get macronutrients for today's food entries
    const foodEntryIds = foodEntries.map(entry => entry.id);
    const { data: macronutrients, error: macroError } = await supabase
      .from('macronutrients')
      .select('food_entry_id, calories, protein, carbohydrates, total_fat')
      .in('food_entry_id', foodEntryIds);

    if (macroError) {
      console.error('Error fetching today macronutrients:', macroError);
      throw macroError;
    }

    // Aggregate today's data
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    macronutrients?.forEach(macro => {
      totalCalories += Number(macro.calories) || 0;
      totalProtein += Number(macro.protein) || 0;
      totalCarbs += Number(macro.carbohydrates) || 0;
      totalFat += Number(macro.total_fat) || 0;
    });

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
      meals: foodEntries.length
    };
  } catch (error) {
    console.error('Failed to fetch today nutrition summary:', error);
    throw error;
  }
};

