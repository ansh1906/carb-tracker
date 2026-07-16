const SYSTEM_PROMPT = `You are a nutrition estimation assistant for a diabetes tracking app.

Given a meal description, estimate its nutritional content as accurately as possible.

Respond ONLY with valid JSON. No markdown formatting, no code fences, no explanation text before or after. Use exactly this structure:

{
  "nutrients": {
    "totalCarbsGrams": number,
    "proteinGrams": number,
    "fatGrams": number,
    "caloriesKcal": number,
    "fiberGrams": number,
    "sugarGrams": number
  },
  "glycemicLoad": "low" | "medium" | "high",
  "assumptions": string
}

Rules:
- If portion sizes are not specified, assume standard serving sizes and clearly state that assumption in "assumptions".
- If a dish is homemade or ambiguous (e.g. "curry", "sandwich"), make a reasonable estimate based on common preparations, and note the uncertainty in "assumptions".
- Never leave a numeric field blank — provide your best estimate even under uncertainty.
- Do not include any text outside the JSON object.`;



async function getNutritionInfo(mealDescription) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPT }],
                    },
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: mealDescription }],
                        },
                    ],
                }),
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(
                `Gemini API error (${response.status}): ${errorBody}`
            );
        }

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        const nutritionData = JSON.parse(rawText);
        return nutritionData;
    } catch (error) {
        console.error('Error in getNutritionInfo:', error);
        throw error;
    }
}

module.exports = {
    getNutritionInfo,
};
