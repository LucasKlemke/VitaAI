import { generateObject } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';



export async function POST(req: Request): Promise<Response> {
  try {
    const { image, userId, imageUrl, mealType } = await req.json();

    const foodAnalysisSchema = z.object({
      foodAnalysis: z.object({
        food_name: z.string(),
        description: z.string(),
        food_category: z.string(),
        portion_size: z.number(),
        portion_description: z.string(),
        confidence_score: z.number().min(0).max(1),
        macronutrients: z.object({
          calories: z.number(),
          protein: z.number(),
          carbohydrates: z.number(),
          total_carbs: z.number(),
          dietary_fiber: z.number(),
          net_carbs: z.number(),
          total_fat: z.number(),
          saturated_fat: z.number(),
          trans_fat: z.number(),
          monounsaturated_fat: z.number(),
          polyunsaturated_fat: z.number(),
          cholesterol: z.number(),
          sodium: z.number(),
          sugar: z.number(),
          added_sugar: z.number()
        }),
        micronutrients: z.object({
          vitamin_a: z.number(),
          vitamin_c: z.number(),
          vitamin_d: z.number(),
          vitamin_e: z.number(),
          vitamin_k: z.number(),
          vitamin_b1_thiamine: z.number(),
          vitamin_b2_riboflavin: z.number(),
          vitamin_b3_niacin: z.number(),
          vitamin_b5_pantothenic_acid: z.number(),
          vitamin_b6_pyridoxine: z.number(),
          vitamin_b7_biotin: z.number(),
          vitamin_b9_folate: z.number(),
          vitamin_b12_cobalamin: z.number(),
          calcium: z.number(),
          iron: z.number(),
          magnesium: z.number(),
          phosphorus: z.number(),
          potassium: z.number(),
          zinc: z.number(),
          copper: z.number(),
          manganese: z.number(),
          selenium: z.number(),
          iodine: z.number(),
          chromium: z.number(),
          molybdenum: z.number()
        }),
        health_benefits: z.array(z.string()),
      })
    });

    const prompt = `
    Analise esta imagem de alimento e forneça informações nutricionais abrangentes.

      Instruções:
      1. Forneça estimativas realistas baseadas em bancos de dados nutricionais científicos
      2. Todos os valores nutricionais devem ser números decimais
      3. portion_size deve ser em gramas
      4. confidence_score deve ser entre 0.00 e 1.00
      5. Valores de micronutrientes devem estar nas unidades corretas (mg, mcg, etc.)
      6. Responda sempre em português brasileiro
      7. Seja específico e preciso com os valores nutricionais
    `



    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: foodAnalysisSchema,
      messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Analise esta imagem de alimento e forneça informações nutricionais abrangentes.' },
        {
          type: 'image',
          image: image.inlineData.data,
        },
      ],
    },
  ],
      system: prompt,
    });

    return Response.json({
      success: true,
      data: object,
      userId: userId,
      imageUrl: imageUrl,
      mealType: mealType || 'snack'
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
