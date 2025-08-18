const sgMail = require("@sendgrid/mail");
import { createClient } from '@supabase/supabase-js'

// Clé SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  // Autoriser CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    // Récupérer le titre, description, photo_url, lien_youtube depuis le body
    const { titre, description, photo_url, lien_youtube } = JSON.parse(event.body || "{}");

    // Récupérer le premier email depuis la table "abonnés"
    const { data: subscribers, error } = await supabase
      .from('abonnes') // nom exact de ta table
      .select('email')
      .limit(1);

    if (error) {
      console.error("Erreur Supabase:", error);
      throw error;
    }

    if (!subscribers || subscribers.length === 0) {
      throw new Error("Aucun abonné trouvé");
    }

    const recipient = subscribers[0].email;

    const htmlContent = `
      <h2>${titre || "Recette du jour"}</h2>
      <p>${description || "Découvrez notre nouvelle recette !"}</p>
      ${photo_url ? `<img src="${photo_url}" width="300" />` : ""}
      ${lien_youtube ? `<p><a href="${lien_youtube}">Voir la vidéo</a></p>` : ""}
    `;

    const msg = {
      to: recipient,
      from: process.env.SENDGRID_FROM,
      subject: `Nouvelle recette : ${titre || "Silence, ça mijote"}`,
      html: htmlContent
    };

    await sgMail.send(msg);

    console.log("Email envoyé à :", recipient);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: `Notification envoyée à ${recipient}` })
    };

  } catch (error) {
    console.error("Erreur d’envoi:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
