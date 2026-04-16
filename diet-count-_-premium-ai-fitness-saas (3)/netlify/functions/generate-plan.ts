import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email, phone, age, gender, height, weight, goal, diet, filters, otherAllergy, workoutDays } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "MY_OPENAI_API_KEY") {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OpenAI API key is missing. Please add OPENAI_API_KEY in Site Settings > Environment Variables in Netlify dashboard." }),
      };
    }

    // Initialize inside handler for serverless stability
    const openai = new OpenAI({ apiKey });

    const systemPrompt = "You are a professional Indian dietician and fitness coach. Generate accurate, realistic, and practical diet plans using Indian foods.";
    
    const userPrompt = `Create a premium personalized Indian diet plan:

Name: ${name}
Age: ${age}
Gender: ${gender}
Height: ${height}
Weight: ${weight}
Goal: ${goal}
Diet Type: ${diet}
Food Restrictions: ${filters}${otherAllergy ? ', ' + otherAllergy : ''}
Workout Plan Days: ${workoutDays}

Include:
- Calories per day
- Food in grams/ml
- Calories per meal
- Veg + Non-veg options

STRUCTURE:
1. Calories Range
2. Morning (empty stomach)
3. Breakfast
4. Mid-Morning Meal (NEW)
5. Lunch
6. Evening Snack
7. Dinner
8. Before Bed
9. Workout Plan (if selected)
10. Tips

Keep format clean for PDF generation.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const plan = response.choices[0].message.content;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan }),
    };
  } catch (error: any) {
    console.error("Error generating plan:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Failed to generate plan" }),
    };
  }
};
