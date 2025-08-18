const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  // Autoriser CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Réponse aux requêtes OPTIONS (pré-vol)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ message: "OK" }) };
  }

  try {
    // Récupère les données envoyées depuis l'admin
    const { email, titre, description } = JSON.parse(event.body || "{}");

    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Aucun email fourni" }) };
    }

    const htmlContent = `
      <h2>${titre || "Recette du jour"}</h2>
      <p>${description || "Découvrez notre nouvelle recette !"}</p>
      <p>Bonne dégustation ! 🍲</p>
      <p>Pour vous désabonner, envoyez un email à <strong>contact.silencecamijote@gmail.com</strong></p>
    `;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM, // Doit être validé sur SendGrid
      subject: `Nouvelle recette : ${titre || "Silence, ça mijote"}`,
      html: htmlContent
    };

    await sgMail.send(msg);

    console.log("Email envoyé à :", email);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: `Notification envoyée à ${email}` })
    };

  } catch (error) {
    console.error("Erreur notifySingle:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
