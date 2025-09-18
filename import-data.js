import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    // Load service account
    const serviceAccountPath = path.join(__dirname, "firebase_secrets.json");
    console.log("Loading service account from:", serviceAccountPath);
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));    // Load clinics data
    const clinicsPath = path.join(__dirname, "clinics_with_coords.json");
    console.log("📂 Reading clinics data from:", clinicsPath);
    const clinicsData = JSON.parse(fs.readFileSync(clinicsPath, "utf8"));

    if (!Array.isArray(clinicsData)) {
      throw new Error("Clinics data must be an array");
    }

    // Init Firebase
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });    const db = admin.firestore();
    console.log("🔥 Connected to Firestore");

    // Process in batches of 500 (Firestore batch limit)
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < clinicsData.length; i += batchSize) {
      const batch = db.batch();
      const chunk = clinicsData.slice(i, i + batchSize);
      
      chunk.forEach((clinic) => {
        const docRef = db.collection("clinics").doc();
        const clinicData = {
          ...clinic,
          location: new admin.firestore.GeoPoint(
            parseFloat(clinic.latitude) || 0,
            parseFloat(clinic.longitude) || 0
          ),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        batch.set(docRef, clinicData);
      });
      
      batches.push(batch);
    }

    // Execute all batches in sequence
    console.log(`🚀 Starting import of ${clinicsData.length} clinics...`);
    
    for (let i = 0; i < batches.length; i++) {
      await batches[i].commit();
      const progress = ((i + 1) / batches.length * 100).toFixed(1);
      console.log(`✅ Batch ${i + 1}/${batches.length} committed (${progress}%)`);
    }

    console.log(`🎉 Successfully imported ${clinicsData.length} clinics to Firestore!`);

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
