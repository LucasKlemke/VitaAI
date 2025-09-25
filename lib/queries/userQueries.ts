import { supabase } from "../supabase";

// Function to create user profile in Supabase after Clerk sign-up
export const createUserProfile = async (clerkId: string, email: string, fullName?: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        clerk_id: clerkId,
        email: email,
        full_name: fullName || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    return data; // Returns the created profile
  } catch (error) {
    console.error('Failed to create user profile:', error);
    throw error;
  }
};

// Function to get user profile by Clerk ID
export const getUserProfile = async (clerkId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};
