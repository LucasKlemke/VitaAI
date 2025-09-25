import { GoogleGenerativeAI } from '@google/generative-ai';

const genAi = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY as string);

export async function POST(req: Request): Promise<Response> {
  try {
    const { image } = await req.json();

    const model = genAi.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Analise esta imagem de alimento e forneça informações nutricionais abrangentes no seguinte formato JSON:
{
  "foodAnalysis": {
    "identifiedFood": "Nome e descrição detalhada",
    "foodCategory": "Categoria principal do alimento (ex: Frutas, Laticínios, Grãos)",
    "healthScore": 0-100, // Pontuação de qualidade nutricional
    "portionSize": "Tamanho estimado da porção em gramas",
    "recognizedServingSize": "Tamanho padrão da porção em gramas",
    "nutritionFacts": {
      "perPortion": {
        "calories": "Calorias estimadas",
        "protein": "Proteína em gramas",
        "carbs": "Carboidratos em gramas",
        "fat": "Gordura em gramas",
        "fiber": "Fibra em gramas",
        "sugar": "Açúcar em gramas",
        "sodium": "Sódio em mg",
        "cholesterol": "Colesterol em mg"
      },
      "per100g": {
        "calories": "Calorias por 100g",
        "protein": "Proteína por 100g",
        "carbs": "Carboidratos por 100g",
        "fat": "Gordura por 100g",
        "fiber": "Fibra por 100g",
        "sugar": "Açúcar por 100g",
        "sodium": "Sódio por 100g",
        "cholesterol": "Colesterol por 100g"
      },
      "macronutrientDistribution": {
        "proteinPercentage": "Porcentagem de calorias da proteína",
        "carbsPercentage": "Porcentagem de calorias dos carboidratos",
        "fatPercentage": "Porcentagem de calorias da gordura"
      }
    },
    "micronutrients": [
      {
        "name": "Vitamina A",
        "amount": "Quantidade",
        "dailyValue": "Porcentagem do valor diário"
      }
    ],
    "healthBenefits": [
      "Principais benefícios para a saúde deste alimento"
    ],
    "potentialConcerns": [
      "Quaisquer preocupações dietéticas ou alérgenos"
    ],
    "preparationTips": [
      "Melhores formas de preparar para máxima nutrição"
    ],
    "storageRecommendations": [
      "Como armazenar adequadamente este alimento"
    ],
    "sustainabilityInfo": {
      "carbonFootprint": "Pegada de CO2 estimada por porção",
      "seasonality": "Quando este alimento está na época"
    }
  }
}

Instruções adicionais:
1. Forneça estimativas realistas baseadas em bancos de dados nutricionais científicos
2. Inclua pelo menos 3 micronutrientes quando disponível
3. Dê conselhos de saúde específicos e acionáveis
4. Formate todos os números sem unidades no JSON (ex: 25 não 25g)
5. Nunca retorne formatação markdown, apenas JSON puro
6. Para sorvete não inclua parfait.
7. Responda sempre em português brasileiro.
`;


    const result = await model.generateContent([prompt, image]);
    const response =  result.response;
    const text = response.text();

    // Clean up the response text to remove any markdown formatting
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();

    // Parse the response text as JSON to validate the format
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedText);
    } catch (error) {
      console.error('Failed to parse Gemini response as JSON:', error);
      throw new Error('Invalid response format from Gemini');
    }

    return Response.json({
      success: true,
      data: parsedResponse,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
