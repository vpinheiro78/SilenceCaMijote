// notifyAll.js
const sgMail = require("@sendgrid/mail");
const { createClient } = require("@supabase/supabase-js");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY // clé anonyme suffit pour lire les abonnés
);

exports.handler = async (event) => {
  // Gérer CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    };
  }

  try {
    const { recetteId, titre, description, photo_url, lien_youtube } = JSON.parse(event.body);

    // Récupérer tous les abonnés
    const { data: abonnés, error } = await supabase.from("abonnés").select("email");
    if (error) throw error;

    if (!abonnés || abonnés.length === 0) {
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Aucun abonné trouvé" }),
      };
    }

    // Construire l'email
    const emails = abonnés.map(a => a.email);
    const msg = {
      to: emails, // SendGrid gère plusieurs destinataires
      from: process.env.SENDGRID_FROM,
      subject: `Nouvelle recette : ${titre} 🍲`,
      html: `
        <h2>${titre}</h2>
        <p>${description}</p>
        ${photo_url ? `<img src="${photo_url}" width="400" />` : ""}
        ${lien_youtube ? `<p>Voir la vidéo : <a href="${lien_youtube}">${lien_youtube}</a></p>` : ""}
        <p><a href="https://silencecamijote.fr/recette/${recetteId}">Voir la recette en ligne</a></p>
      `,
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Emails envoyés à tous les abonnés ✅" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
