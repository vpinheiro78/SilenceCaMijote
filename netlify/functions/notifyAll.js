const sgMail = require("@sendgrid/mail");
const { createClient } = require("@supabase/supabase-js");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// URL et clé Supabase (service role ou anonyme si lecture simple)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  try {
    const { titre, description, photo_url, lien_youtube } = JSON.parse(event.body);

    // Récupérer tous les abonnés
    const { data: abonnés, error } = await supabase.from("abonnés").select("email");
    if (error) throw error;

    if (!abonnés || abonnés.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ message: "Aucun abonné trouvé." }) };
    }

    // Préparer le contenu HTML (simple exemple)
    const htmlContent = `
      <h2>Nouvelle recette : ${titre}</h2>
      <p>${description}</p>
      ${photo_url ? `<img src="${photo_url}" style="max-width:300px;"/>` : ""}
      ${lien_youtube ? `<p>Regardez la vidéo : <a href="${lien_youtube}">Voir sur YouTube</a></p>` : ""}
      <p><a href="https://silencecamijote.fr">Voir la recette sur le site</a></p>
    `;

    // Envoyer l’email à chaque abonné
    for (const abo of abonnés) {
      const msg = {
        to: abo.email,
        from: process.env.SENDGRID_FROM,
        subject: `Nouvelle recette : ${titre} 🍲`,
        html: htmlContent,
      };
      await sgMail.send(msg);
    }

    return { statusCode: 200, body: JSON.stringify({ message: "Notifications envoyées à tous les abonnés ✅" }) };
  } catch (err) {
    console.error("Erreur notifyAll:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
