const sgMail = require('@sendgrid/mail')
const fs = require('fs')
const path = require('path')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const SITE_URL = process.env.SITE_URL || 'https://silencecamijote.netlify.app'
const FROM_EMAIL = process.env.SENDGRID_FROM || 'victor_pinheiro6@hotmail.com' // expéditeur validé SendGrid
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'victor.pinheiro@exovision.fr'

function loadTemplate(filename, vars) {
  const filePath = path.join(__dirname, '..', 'emails', filename)
  let html = fs.readFileSync(filePath, 'utf8')
  html = html.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '')
  return html
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let payload = {}
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const email = (payload.email || payload.to || '').trim().toLowerCase()
  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'email required' }) }
  }

  const unsubscribe_url = `${SITE_URL}/.netlify/functions/unsubscribe?email=${encodeURIComponent(email)}`

  const welcomeHtml = loadTemplate('welcome.html', {
    email,
    site_url: SITE_URL,
    unsubscribe_url
  })

  const adminHtml = loadTemplate('admin-notification.html', {
    email,
    site_url: SITE_URL
  })

  try {
    await sgMail.send([
      {
        to: email,
        from: FROM_EMAIL,
        subject: 'Bienvenue sur Silence, ça mijote 🍽️',
        html: welcomeHtml
      },
      {
        to: ADMIN_EMAIL,
        from: FROM_EMAIL,
        subject: 'Nouvel abonné à la newsletter',
        html: adminHtml
      }
    ])

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    console.error('SendGrid error:', err)
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
