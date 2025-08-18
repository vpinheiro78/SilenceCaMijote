const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  // Autoriser les requêtes CORS
  const headers = {
    "Access-Control-Allow-Origin": "*", // Ou ton domaine à la place de *
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Réponse aux requêtes OPTIONS (pré-vol CORS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    // Ici, tu peux figer le mail destinataire pour test
    const recipient = "victor.pinheiro@exovision.fr";

    // Tu peux aussi récupérer le titre, description etc. depuis le body si tu veux
    const { titre, description, photo_url, lien_youtube } = JSON.parse(event.body || "{}");

    const htmlContent = `
      <h2>${titre || "Recette du jour"}</h2>
      <p>${description || "Découvrez notre nouvelle recette !"}</p>
      ${photo_url ? `<img src="${photo_url}" width="300" />` : ""}
      ${lien_youtube ? `<p><a href="${lien_youtube}">Voir la vidéo</a></p>` : ""}
    `;

    const msg = {
      to: recipient,
      from: process.env.SENDGRID_FROM, // Doit être validé sur SendGrid
      subject: `Nouvelle recette : ${titre || "Silence, ça mijote"}`,
      html: htmlContent
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Notification envoyée avec succès !" })
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
