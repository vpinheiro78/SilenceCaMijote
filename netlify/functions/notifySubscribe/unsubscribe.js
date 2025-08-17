// netlify/functions/unsubscribe.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // clé service pour écrire
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  try {
    const { email } = event.queryStringParameters || {};

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email requis' }),
      };
    }

    // Supprimer ou mettre à jour l’abonné
    const { data, error } = await supabase
      .from('abonne')
      .delete()
      .eq('email', email);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Vous êtes désabonné avec succès.' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur' }),
    };
  }
};
