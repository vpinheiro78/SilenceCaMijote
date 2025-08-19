// netlify/functions/googleStats.js
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export const handler = async (event, context) => {
  try {
    // --- Chemin vers ton fichier JSON d'auth Google Service Account ---
    const keyFilePath = path.join(process.cwd(), 'credentials.json'); 
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
    });

    const webmasters = google.webmasters({ version: 'v3', auth });
    
    // --- Domain ou propriété validée dans Search Console ---
    const siteUrl = 'sc-domain:silencecamijote.fr';

    // --- Récupération des 7 derniers jours ---
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const start = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000); // 7 jours
    const startDate = start.toISOString().split('T')[0];

    const response = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['date'],
        rowLimit: 50
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.data.rows || [])
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Impossible de récupérer les stats Google' })
    };
  }
};
