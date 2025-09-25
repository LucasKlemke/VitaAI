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
