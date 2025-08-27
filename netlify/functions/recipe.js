import OpenAI from "openai";

export const handler = async (event) => {
  try {
    // Vérifier que la requête est POST
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Lire le message depuis le body
    const { message } = JSON.parse(event.body);

    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ reply: "Message manquant" }) };
    }

    // Instanciation OpenAI avec la clé côté serveur
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Appel à GPT-4o mini
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
  role: "system", 
  content: `Tu es Hugo, un chef virtuel qui parle uniquement en français. 
  Donne TOUJOURS une recette complète, structurée en trois parties :
  1. Un titre clair et appétissant.
  2. Une liste d'ingrédients précise avec quantités (au format liste, sans gras inutile).
  3. Une préparation détaillée, étape par étape (numérotée). 
  Ne coupe jamais ta réponse, même si c’est long.` 
},
		
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const gptReply = response.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: gptReply })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "⚠️ Une erreur est survenue côté serveur." })
    };
  }
};
