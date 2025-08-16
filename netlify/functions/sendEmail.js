const sgMail = require('@sendgrid/mail');

// On utilise la clé SendGrid depuis Netlify
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { to, subject, text } = JSON.parse(event.body);

    if (!to || !subject || !text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Veuillez fournir to, subject et text' })
      };
    }

    const msg = {
      to,
      from: 'victor_pinheiro6@hotmail.com', // remplace par ton email validé SendGrid
      subject,
      text
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, echo: { to, subject, text } })
    };
  } catch (err) {
    console.error('ERROR SENDING EMAIL:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
