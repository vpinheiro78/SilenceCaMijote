const sgMail = require("@sendgrid/mail");
const { createClient } = require("@supabase/supabase-js");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// URL et clé anonyme Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  // Gestion CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    const { recetteId } = JSON.parse(event.body);

    // Récupérer la recette
    const { data: recette, error: recetteErr } = await supabase
      .from("recettes")
      .select("*")
      .eq("id", recetteId)
      .single();

    if (recetteErr || !recette) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Recette introuvable" }),
      };
    }

    // Récupérer les abonnés
    const { data: abonnés, error: subErr } = await supabase.from("abonnés").select("email");
    if (subErr) throw subErr;

    // Envoyer l'email à chaque abonné
    const sendPromises = abonnés.map((sub) => {
      return sgMail.send({
        to: sub.email,
        from: process.env.SENDGRID_FROM,
        subject: `Nouvelle recette : ${recette.titre}`,
        html: `
          <h1>${recette.titre}</h1>
          <p>${recette.description}</p>
          ${recette.photo_url ? `<img src="${recette.photo_url}" style="max-width:300px"/>` : ""}
          ${recette.lien_youtube ? `<p>Regardez la vidéo : <a href="${recette.lien_youtube}">${recette.lien_youtube}</a></p>` : ""}
          <p>Bonne dégustation ! 🍲</p>
        `,
      });
    });

    await Promise.all(sendPromises);

    return { statusCode: 200, headers, body: JSON.stringify({ message: "Notification envoyée à tous les abonnés ✅" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
