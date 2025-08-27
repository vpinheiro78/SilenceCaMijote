import OpenAI from "openai";

export const handler = async (event) => {
  try {
    // Vérifier que la requête est POST
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Lire et sécuriser le body
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch (e) {
      console.error("Body invalide:", e);
      return { statusCode: 400, body: JSON.stringify({ reply: "Body invalide" }) };
    }

    const { message, persons } = body;

    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ reply: "Message manquant" }) };
    }

    console.log("Message reçu:", message, " | Nombre de personnes:", persons);

    // Instanciation OpenAI avec la clé côté serveur
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const personsText = (persons && !isNaN(persons)) ? persons : 1;

    // Prompt système générique et clair (utilise personsText pour donner un contexte précis)
    const systemPrompt = `
Tu es Hugo, un chef virtuel francophone.
Ta mission : proposer des recettes variées, originales et adaptées au nombre de personnes indiqué par l'utilisateur.
Évite les répétitions trop fréquentes (par exemple quinoa ou salades trop basiques).
Répond TOUJOURS en Markdown et en français, avec une structure claire en trois parties :
1) Un titre appétissant.
2) Une liste d'ingrédients avec quantités adaptées pour ${personsText} personne(s).
3) Une préparation détaillée, étape par étape (numérotée).
Ne coupe jamais la réponse — fournis la recette complète, facile à suivre et de saison si demandé.
`;

    // Appel à GPT-4o mini
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const gptReply = response.choices?.[0]?.message?.content || "";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: gptReply })
    };

  } catch (error) {
    console.error("Erreur serveur:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "⚠️ Une erreur est survenue côté serveur." })
    };
  }
};
