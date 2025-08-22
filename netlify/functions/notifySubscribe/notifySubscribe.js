const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Traductions multi-langues
const mailTranslations = {
  fr: { subject: "Bienvenue sur Silence, ça mijote 🍲", discover: "Découvrir les recettes", greeting: "Bonjour 👋", intro: "Merci de nous avoir rejoint !", alert: "Vous êtes désormais inscrit(e) et recevrez une alerte à chaque publication d’une nouvelle recette.", contact: "Contactez-nous à", emailLabel: "Votre email", unsubscribe: "Pour ne plus recevoir nos recettes, envoyez un email à" },
  en: { subject: "Welcome to Silence, ça mijote 🍲", discover: "Discover recipes", greeting: "Hello 👋", intro: "Thank you for joining us!", alert: "You are now subscribed and will receive an alert for each new recipe.", contact: "Contact us at", emailLabel: "Your email", unsubscribe: "To stop receiving our recipes, send an email to" },
  es: { subject: "Bienvenido a Silence, ça mijote 🍲", discover: "Descubrir recetas", greeting: "Hola 👋", intro: "¡Gracias por unirte!", alert: "Ahora estás suscrito y recibirás una alerta por cada nueva receta.", contact: "Contáctanos en", emailLabel: "Tu email", unsubscribe: "Para dejar de recibir nuestras recetas, envía un email a" },
  it: { subject: "Benvenuto su Silence, ça mijote 🍲", discover: "Scopri le ricette", greeting: "Ciao 👋", intro: "Grazie per esserti unito!", alert: "Ora sei iscritto e riceverai una notifica per ogni nuova ricetta.", contact: "Contattaci a", emailLabel: "La tua email", unsubscribe: "Per non ricevere più le ricette, invia un'email a" },
  pt: { subject: "Bem-vindo ao Silence, ça mijote 🍲", discover: "Descobrir receitas", greeting: "Olá 👋", intro: "Obrigado por se juntar a nós!", alert: "Você está inscrito e receberá alertas para cada nova receita.", contact: "Contate-nos em", emailLabel: "Seu email", unsubscribe: "Para não receber mais nossas receitas, envie um email para" },
  de: { subject: "Willkommen bei Silence, ça mijote 🍲", discover: "Rezepte entdecken", greeting: "Hallo 👋", intro: "Danke, dass Sie sich uns angeschlossen haben!", alert: "Sie sind nun angemeldet und erhalten Benachrichtigungen für jedes neue Rezept.", contact: "Kontaktieren Sie uns unter", emailLabel: "Ihre E-Mail", unsubscribe: "Um keine Rezepte mehr zu erhalten, senden Sie eine E-Mail an" },
};

exports.handler = async (event) => {
  try {
    const { email, lang = "fr" } = JSON.parse(event.body);
    const t = mailTranslations[lang] || mailTranslations["fr"];

    // Lire le template HTML
    const templatePath = path.join(__dirname, "welcome.html");
    let htmlContent = fs.readFileSync(templatePath, "utf8");

    // Remplacer les variables dynamiques
    htmlContent = htmlContent
      .replace(/{{email}}/g, email)
      .replace(/{{site_url}}/g, "https://silencecamijote.fr")
      .replace(/{{unsubscribe_url}}/g, "https://silencecamijote.fr/unsubscribe")
      .replace(/{{subject}}/g, t.subject)
      .replace(/{{greeting}}/g, t.greeting)
      .replace(/{{intro}}/g, t.intro)
      .replace(/{{alert}}/g, t.alert)
      .replace(/{{contact}}/g, t.contact)
      .replace(/{{emailLabel}}/g, t.emailLabel)
      .replace(/{{discover}}/g, t.discover)
      .replace(/{{unsubscribe}}/g, t.unsubscribe);

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: t.subject,
      html: htmlContent,
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Email envoyé avec succès à ${email} (${lang}) !` }),
    };
  } catch (error) {
    console.error("Erreur d’envoi:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
