-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
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

-- Create indexes for better performance
CREATE INDEX idx_food_entries_user_id ON public.food_entries(user_id);
CREATE INDEX idx_food_entries_date ON public.food_entries(date);
CREATE INDEX idx_food_entries_user_date ON public.food_entries(user_id, date);
CREATE INDEX idx_macronutrients_food_entry_id ON public.macronutrients(food_entry_id);
CREATE INDEX idx_micronutrients_food_entry_id ON public.micronutrients(food_entry_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_food_entries_updated_at
    BEFORE UPDATE ON public.food_entries
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.macronutrients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micronutrients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Food entries policies
CREATE POLICY "Users can view own food entries" ON public.food_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food entries" ON public.food_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food entries" ON public.food_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food entries" ON public.food_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Macronutrients policies
CREATE POLICY "Users can view macros for own food entries" ON public.macronutrients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.food_entries 
            WHERE food_entries.id = macronutrients.food_entry_id 
            AND food_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert macros for own food entries" ON public.macronutrients
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.food_entries 
            WHERE food_entries.id = macronutrients.food_entry_id 
            AND food_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update macros for own food entries" ON public.macronutrients
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.food_entries 
            WHERE food_entries.id = macronutrients.food_entry_id 
            AND food_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete macros for own food entries" ON public.macronutrients
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.food_entries 
            WHERE food_entries.id = macronutrients.food_entry_id 
            AND food_entries.user_id = auth.uid()
        )
    );

-- Micronutrients policies (same pattern as macronutrients)
CREATE POLICY "Users can view micros for own food entries" ON public.micronutrients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.food_entries 
            WHERE food_entries.id = micronutrients.food_entry_id 
            AND food_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert micros for own food entries" ON public.micronutrients
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.food_entries 
            WHERE food_entries.id = micronutrients.food_entry_id 
            AND food_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update micros for own food entries" ON public.micronutrients
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.food_entries 
            WHERE food_entries.id = micronutrients.food_entry_id 
            AND food_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete micros for own food entries" ON public.micronutrients
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.food_entries 
            WHERE food_entries.id = micronutrients.food_entry_id 
            AND food_entries.user_id = auth.uid()
        )
    );

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Useful views for easier querying

-- Complete food entry view with nutrients
CREATE VIEW public.complete_food_entries AS
SELECT 
    fe.id,
    fe.user_id,
    fe.date,
    fe.time,
    fe.meal_type,
    fe.food_name,
    fe.description,
    fe.image_url,
    fe.portion_size,
    fe.portion_description,
    fe.confidence_score,
    fe.created_at,
    -- Macronutrients
    m.calories,
    m.protein,
    m.carbohydrates,
    m.total_fat,
    m.dietary_fiber,
    m.sugar,
    m.sodium,
    -- Key micronutrients
    mi.vitamin_c,
    mi.vitamin_d,
    mi.calcium,
    mi.iron,
    mi.potassium
FROM public.food_entries fe
LEFT JOIN public.macronutrients m ON fe.id = m.food_entry_id
LEFT JOIN public.micronutrients mi ON fe.id = mi.food_entry_id;

-- Daily nutrition summary view
CREATE VIEW public.daily_nutrition_summary AS
SELECT 
    fe.user_id,
    fe.date,
    COUNT(fe.id) as total_entries,
    SUM(m.calories) as total_calories,
    SUM(m.protein) as total_protein,
    SUM(m.carbohydrates) as total_carbs,
    SUM(m.total_fat) as total_fat,
    SUM(m.dietary_fiber) as total_fiber,
    SUM(m.sodium) as total_sodium
FROM public.food_entries fe
LEFT JOIN public.macronutrients m ON fe.id = m.food_entry_id
GROUP BY fe.user_id, fe.date
ORDER BY fe.date DESC;