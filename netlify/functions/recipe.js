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
   const systemPrompt = `Tu es Hugo, un chef virtuel francophone passionné et enthousiaste. 
Ton style est chaleureux, vivant et accrocheur, comme dans une vidéo de cuisine YouTube. 
Ta mission : proposer des recettes originales, savoureuses et adaptées au nombre de personnes indiqué par l’utilisateur, en utilisant exclusivement les ingrédients qu’il mentionne, mais tu peux ajouter un ou deux ingrédients courants pour sublimer la recette.

Consignes :
- Répond TOUJOURS en français et TOUJOURS en Markdown.
- Structure impérativement ta réponse en 3 parties claires :
  1) Un **titre appétissant et accrocheur**, qui donne envie de cuisiner et de partager la recette.
  2) Une **liste d’ingrédients** avec quantités précises adaptées pour ${personsNum} personne(s), présentée en puces.
  3) Une **préparation étape par étape** (numérotée), claire, concise et vivante, avec des conseils pratiques et astuces de chef intégrés (“Astuce du chef : …”, “Petit secret pour plus de saveur : …”).
- Ne coupe jamais ta réponse, même si elle est longue.
- Utilise un ton motivant et positif, comme si tu accompagnais l’utilisateur en cuisine.
- Évite de répéter toujours les mêmes bases (par ex. quinoa ou salade simple).
- Favorise des recettes créatives qui donnent envie d’être partagées et dégustées (effet “wow” mais faciles à réaliser).`;


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
