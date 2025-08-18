const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  // Autoriser CORS
  const headers = {
    "Access-Control-Allow-Origin": "*", // ou ton domaine
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Réponse aux requêtes OPTIONS (pré-vol)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // Récupère les données envoyées depuis l'admin
    const { email, titre, description, photo_url, lien_youtube } = JSON.parse(event.body || "{}");

    if (!email) {
      return { statusCode: 400, headers, body: "Aucun email fourni" };
    }

    const htmlContent = `
      <h2>${titre || "Recette du jour"}</h2>
      <p>${description || "Découvrez notre nouvelle recette !"}</p>
      ${photo_url ? `<img src="${photo_url}" style="max-width:100%;height:auto;" />` : ""}
      ${lien_youtube ? `<p><a href="${lien_youtube}">Voir la vidéo</a></p>` : ""}
      <p>Bonne dégustation ! 🍲</p>
    `;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM, // Doit être validé sur SendGrid
      subject: `Nouvelle recette : ${titre || "Silence, ça mijote"}`,
      html: htmlContent
    };

    await sgMail.send(msg);

    console.log("Email envoyé à :", email);

    return { statusCode: 200, headers, body: JSON.stringify({ message: `Notification envoyée à ${email}` }) };

  } catch (error) {
    console.error("Erreur notifySingle:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
