const { createClient } = require('@supabase/supabase-js')

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

exports.handler = async (event) => {
  const email = (event.queryStringParameters && event.queryStringParameters.email || '').trim().toLowerCase()
  if (!email) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: '<h1>Adresse email manquante.</h1>'
    }
  }

  try {
    const supabase = createClient(url, serviceKey)
    await supabase.from('abonnes').delete().eq('email', email)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: '<h1>Vous êtes désabonné(e). Merci.</h1>'
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: '<h1>Erreur lors du désabonnement.</h1>'
    }
  }
}
