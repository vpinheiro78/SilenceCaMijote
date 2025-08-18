const sgMail = require("@sendgrid/mail");
const { createClient } = require('@supabase/supabase-js');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    const { recetteId, titre, description, photo_url, lien_youtube } = JSON.parse(event.body);

    // Récupérer la liste des abonnés
    const { data: abonnés, error: subError } = await supabase.from('abonnés').select('email');
    if (subError) throw subError;

    const msgList = abonnés.map(a => ({
      to: a.email,
      from: process.env.SENDGRID_FROM,
      subject: `Nouvelle recette : ${titre}`,
      html: `<h1>${titre}</h1>
             <p>${description}</p>
             ${photo_url ? `<img src="${photo_url}" width="300"/>` : ''}
             ${lien_youtube ? `<p><a href="${lien_youtube}">Voir la vidéo</a></p>` : ''}`
    }));

    for (const msg of msgList) {
      await sgMail.send(msg);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Notifications envoyées !' }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
