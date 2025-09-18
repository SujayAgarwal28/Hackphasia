import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadClinicsData() {
  try {
    // Initialize Firebase
    const serviceAccountPath = path.join(__dirname, 'firebase_secrets.json');
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();
    console.log('Connected to Firestore');

    // Read clinics data
    const clinicsPath = path.join(__dirname, 'clinics_with_coords.json');
    console.log('Reading clinics data from:', clinicsPath);
    const clinicsData = JSON.parse(fs.readFileSync(clinicsPath, 'utf8'));

    if (!Array.isArray(clinicsData)) {
      throw new Error('Clinics data must be an array');
    }

    console.log(`Found ${clinicsData.length} clinics to upload`);

    // Split data into chunks (Firestore batch limit is 500)
    const chunkSize = 400; // Using 400 to be safe
    const chunks = [];
    for (let i = 0; i < clinicsData.length; i += chunkSize) {
      chunks.push(clinicsData.slice(i, i + chunkSize));
    }

    console.log(`Split data into ${chunks.length} chunks`);

    // Upload chunks
    let totalUploaded = 0;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`\nProcessing chunk ${i + 1}/${chunks.length}`);

      const batch = db.batch();

      // Add each clinic to the batch
      chunk.forEach((clinic) => {
        const docRef = db.collection('clinics').doc(); // Auto-generate ID
        batch.set(docRef, {
          ...clinic,
          location: new admin.firestore.GeoPoint(clinic.lat, clinic.lng),
          created_at: admin.firestore.FieldValue.serverTimestamp(),
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      // Commit the batch
      await batch.commit();
      totalUploaded += chunk.length;
      console.log(`Progress: ${totalUploaded}/${clinicsData.length} clinics uploaded`);
    }

    console.log('\nUpload completed successfully!');
    console.log(`Total clinics uploaded: ${totalUploaded}`);
    console.log('You can now query your clinics collection in Firestore');
    
    // Example query to verify
    const snapshot = await db.collection('clinics').limit(1).get();
    if (!snapshot.empty) {
      console.log('\nSample clinic data:');
      console.log(snapshot.docs[0].data());
    }

  } catch (error) {
    console.error('Error uploading clinics data:', error);
    if (error.code === 'ENOENT') {
      console.error('Could not find the file. Make sure clinics_with_coords.json is in the correct location.');
    }
    process.exit(1);
  }
}

uploadClinicsData();
