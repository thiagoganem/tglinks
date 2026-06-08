/**
 * Script de limpeza: remove todos os documentos de clicks e pageviews
 * onde region.city === "Teresina".
 *
 * Uso:
 *   node scripts/clean-teresina.mjs
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const serviceAccount = require(join(__dirname, "../thggnm-ldpg-firebase-adminsdk.json"));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function deleteByCity(collectionName, city) {
  const ref = db.collection(collectionName);
  const snap = await ref.get();

  const toDelete = snap.docs.filter(
    (doc) => doc.data()?.region?.city === city
  );

  if (toDelete.length === 0) {
    console.log(`[${collectionName}] Nenhum documento de "${city}" encontrado.`);
    return 0;
  }

  // Deleta em batches de 500 (limite do Firestore)
  const BATCH_SIZE = 500;
  let deleted = 0;

  for (let i = 0; i < toDelete.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = toDelete.slice(i, i + BATCH_SIZE);
    chunk.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    deleted += chunk.length;
    console.log(`[${collectionName}] Deletados ${deleted}/${toDelete.length}...`);
  }

  return deleted;
}

async function main() {
  const city = "Teresina";
  console.log(`\n🧹 Iniciando limpeza de registros de "${city}"...\n`);

  const [clicksDeleted, pvDeleted] = await Promise.all([
    deleteByCity("clicks", city),
    deleteByCity("pageviews", city),
  ]);

  console.log(`\n✅ Concluído!`);
  console.log(`   clicks    removidos: ${clicksDeleted}`);
  console.log(`   pageviews removidos: ${pvDeleted}`);
  console.log(`   Total:               ${clicksDeleted + pvDeleted}\n`);
}

main().catch((err) => {
  console.error("❌ Erro:", err);
  process.exit(1);
});
