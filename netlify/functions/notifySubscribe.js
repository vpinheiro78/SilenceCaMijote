import fs from "fs";
import path from "path";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body);

    // Lire le fichier welcome.html
    const filePath = path.resolve("templates", "welcome.html");
    let htmlTemplate = fs.readFileSync(filePath, "utf8");

    // Remplacer les variables dynamiques
    htmlTemplate = htmlTemplate
      .replace("{{email}}", email)
      .replace("{{site_url}}", "https://silencecamijote.fr")
      .replace("{{unsubscribe_url}}", "https://silencecamijote.fr/unsubscribe?email=" + encodeURIComponent(email));

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: "Bienvenue sur Silence, ça mijote !",
      html: htmlTemplate,
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email envoyé avec succès" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur envoi email" }),
    };
  }
};
