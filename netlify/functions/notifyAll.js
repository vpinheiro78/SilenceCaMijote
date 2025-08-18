const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // On prend email du front et on le renomme en recipient
    const { email: recipient, titre, description, photo_url, lien_youtube } = JSON.parse(event.body || "{}");

    if (!recipient) {
      return { statusCode: 400, headers, body: "Aucun email fourni" };
    }

    const htmlContent = `
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Nouvelle recette</title>
  <style>
    .btn{display:inline-block;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700}
    .shadow{box-shadow:0 6px 18px rgba(0,0,0,0.12)}
  </style>
</head>
<body style="margin:0;background:#faf5f0;font-family:Arial,Helvetica,sans-serif;color:#222;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf5f0">
    <tr>
      <td align="center" style="padding:24px">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:14px" class="shadow">
          <tr>
            <td align="center" style="padding:28px 24px 10px">
              <img src="https://silencecamijote.netlify.app/assets/logo.png" alt="Silence, ça mijote" width="96" height="96" style="border-radius:12px;display:block;">
              <h1 style="margin:16px 0 6px;font-size:22px;color:#b04a32;">Nouvelle recette : ${titre}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 6px;font-size:15px;line-height:1.6;color:#333">
              <p>Bonjour 👋</p>
              <p>Une nouvelle recette vient d’être publiée sur « Silence, ça mijote » :</p>
              <h2 style="color:#b04a32">${titre}</h2>
              <p>${description || ""}</p>
              ${photo_url ? `<img src="${photo_url}" style="width:120px;height:auto;border-radius:12px;margin-top:12px;" />` : ""}
              ${lien_youtube ? `<p><a class="btn shadow" href="${lien_youtube}" style="background:#b04a32;color:#fff">Voir la vidéo</a></p>` : ""}
              <p style="margin:0">Votre email : <strong>${recipient}</strong></p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:12px 28px 24px">
              <a class="btn shadow" href="https://silencecamijote.netlify.app" style="background:#b04a32;color:#fff">Découvrir toutes les recettes</a>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 24px;font-size:12px;color:#666;border-top:1px solid #eee">
              <p style="margin:0">
  Pour ne plus recevoir nos recettes, envoyez simplement un email à 
  <a href="mailto:contact.silencecamijote@gmail.com" style="color:#2a4d69">contact.silencecamijote@gmail.com</a> 
  et nous retirerons votre adresse de notre liste.
</p>
            </td>
          </tr>
        </table>

        <p style="font-size:12px;color:#777;margin:14px 0 0;">© 2025 Silence, ça mijote</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const msg = {
      to: recipient,
      from: process.env.SENDGRID_FROM,
      subject: `Nouvelle recette : ${titre}`,
      html: htmlContent
    };

    await sgMail.send(msg);

    return { statusCode: 200, headers, body: JSON.stringify({ message: `Notification envoyée à ${recipient}` }) };

  } catch (error) {
    console.error("Erreur notifyAll:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
