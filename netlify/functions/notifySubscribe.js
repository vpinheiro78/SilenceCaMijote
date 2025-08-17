const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body);

    // Lire le template HTML dans netlify/emails/
    const templatePath = path.join(__dirname, "../emails/welcome.html");
    let htmlContent = fs.readFileSync(templatePath, "utf8");

    // Remplacer les variables dynamiques
    htmlContent = htmlContent
      .replace("{{email}}", email)
      .replace("{{site_url}}", "https://silencecamijote.fr")
      .replace("{{unsubscribe_url}}", "https://silencecamijote.fr/unsubscribe");

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM, // doit être validé dans SendGrid
      subject: "Bienvenue sur Silence, ça mijote 🍲",
      html: htmlContent,
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email envoyé avec succès !" }),
    };
  } catch (error) {
    console.error("Erreur d’envoi:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
