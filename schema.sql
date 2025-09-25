-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food_entries table (main table for logged foods)
CREATE TABLE public.food_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    time TIME WITH TIME ZONE DEFAULT NOW(),
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) DEFAULT 'snack',
    food_name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    image_path TEXT, -- For Supabase Storage reference
    portion_size DECIMAL(10,2), -- in grams
    portion_description TEXT, -- e.g., "1 medium apple", "2 slices"
    confidence_score DECIMAL(3,2), -- AI confidence (0.00 to 1.00)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create macronutrients table
CREATE TABLE public.macronutrients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    food_entry_id UUID REFERENCES public.food_entries(id) ON DELETE CASCADE NOT NULL,
    -- Macros per 100g or per portion
    calories DECIMAL(8,2) NOT NULL DEFAULT 0,
    protein DECIMAL(8,2) NOT NULL DEFAULT 0, -- grams
    carbohydrates DECIMAL(8,2) NOT NULL DEFAULT 0, -- grams
    total_carbs DECIMAL(8,2) DEFAULT 0, -- total carbs including fiber
    dietary_fiber DECIMAL(8,2) DEFAULT 0, -- grams
    net_carbs DECIMAL(8,2) DEFAULT 0, -- total carbs - fiber
    total_fat DECIMAL(8,2) NOT NULL DEFAULT 0, -- grams
    saturated_fat DECIMAL(8,2) DEFAULT 0, -- grams
    trans_fat DECIMAL(8,2) DEFAULT 0, -- grams
    monounsaturated_fat DECIMAL(8,2) DEFAULT 0, -- grams
    polyunsaturated_fat DECIMAL(8,2) DEFAULT 0, -- grams
    cholesterol DECIMAL(8,2) DEFAULT 0, -- mg
    sodium DECIMAL(8,2) DEFAULT 0, -- mg
    sugar DECIMAL(8,2) DEFAULT 0, -- grams
    added_sugar DECIMAL(8,2) DEFAULT 0, -- grams
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create micronutrients table
CREATE TABLE public.micronutrients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    food_entry_id UUID REFERENCES public.food_entries(id) ON DELETE CASCADE NOT NULL,
    -- Vitamins (in mg unless specified)
    vitamin_a DECIMAL(10,4) DEFAULT 0, -- mcg RAE
    vitamin_c DECIMAL(10,4) DEFAULT 0, -- mg
    vitamin_d DECIMAL(10,4) DEFAULT 0, -- mcg
    vitamin_e DECIMAL(10,4) DEFAULT 0, -- mg
    vitamin_k DECIMAL(10,4) DEFAULT 0, -- mcg
    vitamin_b1_thiamine DECIMAL(10,4) DEFAULT 0, -- mg
    vitamin_b2_riboflavin DECIMAL(10,4) DEFAULT 0, -- mg
    vitamin_b3_niacin DECIMAL(10,4) DEFAULT 0, -- mg
    vitamin_b5_pantothenic_acid DECIMAL(10,4) DEFAULT 0, -- mg
    vitamin_b6_pyridoxine DECIMAL(10,4) DEFAULT 0, -- mg
    vitamin_b7_biotin DECIMAL(10,4) DEFAULT 0, -- mcg
    vitamin_b9_folate DECIMAL(10,4) DEFAULT 0, -- mcg
    vitamin_b12_cobalamin DECIMAL(10,4) DEFAULT 0, -- mcg
    -- Minerals
    calcium DECIMAL(10,4) DEFAULT 0, -- mg
    iron DECIMAL(10,4) DEFAULT 0, -- mg
    magnesium DECIMAL(10,4) DEFAULT 0, -- mg
    phosphorus DECIMAL(10,4) DEFAULT 0, -- mg
    potassium DECIMAL(10,4) DEFAULT 0, -- mg
    zinc DECIMAL(10,4) DEFAULT 0, -- mg
    copper DECIMAL(10,4) DEFAULT 0, -- mg
    manganese DECIMAL(10,4) DEFAULT 0, -- mg
    selenium DECIMAL(10,4) DEFAULT 0, -- mcg
    iodine DECIMAL(10,4) DEFAULT 0, -- mcg
    chromium DECIMAL(10,4) DEFAULT 0, -- mcg
    molybdenum DECIMAL(10,4) DEFAULT 0, -- mcg
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);