// netlify/functions/recipe.js
import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    // ⚡ Récupérer le message envoyé depuis le front
    const { message } = await req.json();

    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    // ⚡ Initialiser OpenAI avec la clé stockée en variable d'environnement
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // ⚡ Appeler GPT-4o mini
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu es un chef cuisinier créatif. Donne des recettes claires, simples et appétissantes." },
        { role: "user", content: message },
      ],
    });

    // ⚡ Extraire la réponse
    const reply = response.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Erreur API:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
