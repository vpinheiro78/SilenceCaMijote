import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

// Pour gérer __dirname avec ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const KEYFILEPATH = path.join(__dirname, "credentials.json");

  // Création du client d'authentification
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const client = await auth.getClient();
  const searchconsole = google.searchconsole({ version: "v1", auth: client });

  // Test : récupérer la liste des sites validés dans Search Console
  const res = await searchconsole.sites.list();

  console.log("📊 Sites validés dans Search Console :");
  console.log(res.data);
}

main().catch(console.error);
