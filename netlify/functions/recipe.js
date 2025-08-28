// /netlify/functions/recipe.js
import OpenAI from "openai";

export const handler = async (event) => {
  try {
    // Seules les requêtes POST sont autorisées
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Parse body
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "⚠️ Corps de la requête JSON invalide." })
      };
    }

    const { message, persons } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "⚠️ Message manquant." })
      };
    }

    // Normaliser le nombre de personnes
    const personsNum = (persons && !isNaN(persons)) ? parseInt(persons, 10) : 1;

    // Instanciation OpenAI (clé côté serveur)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // System prompt : fait parler Hugo et précise le format attendu (incl. personsNum)
    const systemPrompt = `Tu es Hugo, un chef virtuel francophone.
Ta mission : proposer des recettes variées, originales et adaptées au nombre de personnes indiqué par l'utilisateur.
Évite de répéter les mêmes bases trop souvent (par exemple le quinoa ou les salades classiques).
Répond TOUJOURS en français et TOUJOURS en Markdown, structuré en trois parties :
1) Un titre appétissant.
2) Une liste d'ingrédients avec quantités adaptées pour ${personsNum} personne(s) (format liste, clair).
3) Une préparation détaillée, étape par étape, numérotée.
Ne coupe jamais ta réponse, même si elle est longue. Assure-toi que la recette soit complète et facile à suivre.`;

    // Appel à l'API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    // Récupération de la réponse (sécurisée)
    const gptReply = response?.choices?.[0]?.message?.content;
    if (!gptReply || typeof gptReply !== "string") {
      console.error("Réponse OpenAI inattendue :", response);
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: "⚠️ Réponse invalide de l'API OpenAI." })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: gptReply })
    };

  } catch (error) {
    console.error("Erreur recipe.js :", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "⚠️ Une erreur est survenue côté serveur." })
    };
  }
};
