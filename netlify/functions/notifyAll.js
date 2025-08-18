const sgMail = require("@sendgrid/mail");
const { createClient } = require("@supabase/supabase-js");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Connexion Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {
    const { recetteId } = JSON.parse(event.body); // ID de recette envoyé depuis admin

    // 1. Récupérer la recette
    const { data: recette, error: recetteError } = await supabase
      .from("recette")
      .select("id, titre, description, image_url")
      .eq("id", recetteId)
      .single();

    if (recetteError || !recette) {
      throw new Error("Recette introuvable !");
    }

    // 2. Récupérer tous les abonnés
    const { data: abonnes, error: abonneError } = await supabase
      .from("abonne")
      .select("email");

    if (abonneError || !abonnes) {
      throw new Error("Impossible de récupérer les abonnés !");
    }

    // 3. Construire le mail
    const htmlContent = `
      <h2>${recette.titre}</h2>
      <img src="${recette.image_url}" alt="${recette.titre}" style="max-width:100%;border-radius:8px"/>
      <p>${recette.description}</p>
      <p>
        <a href="https://silencecamijote.fr/recette.html?id=${recette.id}">
          👉 Découvrez la recette complète ici
        </a>
      </p>
      <hr/>
      <p style="font-size:12px;color:#888">
        Vous ne souhaitez plus recevoir nos emails ?  
        <a href="mailto:contact.silencecamijote@gmail.com">Envoyez-nous un email</a>
      </p>
    `;

    // 4. Envoyer à tous les abonnés
    const messages = abonnes.map((abonne) => ({
      to: abonne.email,
      from: process.env.SENDGRID_FROM, // Expéditeur validé dans SendGrid
      subject: "Une nouvelle recette est en ligne 🍲",
      html: htmlContent,
    }));

    await sgMail.send(messages, false);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notification envoyée avec succès !" }),
    };
  } catch (error) {
    console.error("Erreur d’envoi:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
