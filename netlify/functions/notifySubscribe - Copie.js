	
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function handler(event, context) {
  try {
    const { email } = JSON.parse(event.body)
    if (!email) return { statusCode: 400, body: 'Email manquant' }

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: 'Bienvenue !',
      text: 'Merci pour votre inscription.'
    }

    await sgMail.send(msg)
    return { statusCode: 200, body: JSON.stringify({ message: 'Email envoyé' }) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}