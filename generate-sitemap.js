import fs from "fs";
import { createClient } from "@supabase/supabase-js";

console.log("🚀 Début du script sitemap");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const baseUrl = "https://silencecamijote.fr";

async function generateSitemap() {
  console.log("🔎 Récupération des recettes...");

  const { data: recettes, error } = await supabase
    .from("recettes")
    .select("id, created_at");

  if (error) {
    console.error("❌ Erreur Supabase :", error);
    process.exit(1);
  }

  console.log(`✅ ${recettes.length} recettes récupérées`);

  const today = new Date().toISOString().split("T")[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  sitemap += `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>\n`;

  recettes.forEach((recette) => {
    const lastmod = recette.created_at ? recette.created_at.split("T")[0] : today;
    sitemap += `  <url>
    <loc>${baseUrl}/recette/recette.html?slug=${recette.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  sitemap += `</urlset>`;

  // Crée le dossier public si inexistant
  if (!fs.existsSync("public")) fs.mkdirSync("public");
  console.log("📁 Création du fichier sitemap.xml dans public/");

  fs.writeFileSync("public/sitemap.xml", sitemap);
  console.log("✅ sitemap.xml généré avec succès !");
}

generateSitemap();

