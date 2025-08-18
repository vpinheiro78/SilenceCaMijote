const sgMail = require("@sendgrid/mail");
const { createClient } = require("@supabase/supabase-js");

// Configurer SendGrid et Supabase via variables d'environnement
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", // ou ton domaine admin pour plus de sécurité
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Répondre aux prévol OPTIONS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    const { recetteId } = JSON.parse(event.body);

    if (!recetteId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "recetteId manquant" }) };
    }

    // Récupérer la recette dans Supabase
    const { data: recette, error: recipeError } = await supabase
      .from("recettes")
      .select("*")
      .eq("id", recetteId)
      .single();

    if (recipeError || !recette) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: "Recette introuvable" }) };
    }

    // Récupérer tous les abonnés
    const { data: subscribers, error: subError } = await supabase
      .from("abonnes")
      .select("email");

    if (subError) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: subError.message }) };
    }

    // Préparer les emails
    const messages = subscribers.map(sub => ({
      to: sub.email,
      from: process.env.SENDGRID_FROM,
      subject: `Nouvelle recette : ${recette.titre} 🍲`,
      html: `
        <h2>${recette.titre}</h2>
        <p>${recette.description}</p>
        ${recette.photo_url ? `<img src="${recette.photo_url}
