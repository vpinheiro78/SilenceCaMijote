const sgMail = require("@sendgrid/mail");

// Clé SendGrid à mettre dans les variables d'environnement
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Gestion requête pré-vol OPTIONS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  try {
    const { recetteId, titre, description, photo_url, lien_youtube } = JSON.parse(event.body);

    // Ici tu peux définir un tableau fixe pour test, ou récupérer depuis Supabase
    const abonnés = ["exemple1@mail.com", "exemple2@mail.com"]; // <- à remplacer par tes abonnés réels

    const messages = abonnés.map(email => ({
      to: email,
      from: process.env.SENDGRID_FROM, // Doit être validé sur SendGrid
      subject: `Nouvelle recette : ${titre}`,
      html: `
        <h2>${titre}</h2>
        <p>${description}</p>
        ${photo_url ? `<img src="${photo_url}" style="max-width:100%;height:auto;"/>` : ""}
        ${lien_youtube ? `<p><a href="${lien_youtube}">Voir la vidéo</a></p>` : ""}
        <p>Bonne dégustation ! 🍲</p>
      `
    }));

    // Envoi des mails (SendGrid autorise plusieurs envois via Promise.all)
    await Promise.all(messages.map(msg => sgMail.send(msg)));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: `Notification envoyée à ${abonnés.length} abonnés !` })
    };

  } catch (error) {
    console.error("Erreur notifyAll:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
