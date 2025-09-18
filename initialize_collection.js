import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeCollections() {
  try {
    // Initialize Firebase Admin using service account JSON file
    const serviceAccountPath = path.join(__dirname, 'firebase_secrets.json');
    console.log('Loading service account from:', serviceAccountPath);
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();
    console.log('🔥 Connected to Firestore');

    // Initialize Audio Stories Collection
    const audioStoriesCollection = db.collection('audioStories');
    
    const stories = [
      {
        id: 'journey-of-hope',
        title: 'A Journey of Hope',
        emoji: '⭐',
        description: 'Sometimes the journey feels impossible, but every step forward is a victory.....',
        duration: '3:00',
        category: 'hope',
        tags: ['resilience', 'hope'],
        audioUrl: 'https://storage.googleapis.com/hackuccino.appspot.com/audio/journey-of-hope.mp3',
        transcript: 'Full transcript of the hope journey story...',
        metadata: {
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          language: 'en',
          narrator: 'AI Voice 1',
          backgroundMusic: true
        }
      },
      {
        id: 'finding-strength',
        title: 'Finding Strength Within',
        emoji: '💪',
        description: 'You are stronger than you know. Your courage brought you this far.....',
        duration: '4:00',
        category: 'resilience',
        tags: ['strength', 'courage'],
        audioUrl: 'https://storage.googleapis.com/hackuccino.appspot.com/audio/finding-strength.mp3',
        transcript: 'Full transcript of the strength finding story...',
        metadata: {
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          language: 'en',
          narrator: 'AI Voice 2',
          backgroundMusic: true
        }
      },
      {
        id: 'we-are-not-alone',
        title: 'We Are Not Alone',
        emoji: '🤝',
        description: 'In times of difficulty, we find strength in each other.....',
        duration: '3:20',
        category: 'community',
        tags: ['community', 'support'],
        audioUrl: 'https://storage.googleapis.com/hackuccino.appspot.com/audio/we-are-not-alone.mp3',
        transcript: 'Full transcript of the community support story...',
        metadata: {
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          language: 'en',
          narrator: 'AI Voice 1',
          backgroundMusic: true
        }
      },
      {
        id: 'like-waters-finding-peace',
        title: 'Like Waters Finding Peace',
        emoji: '🌊',
        description: 'Healing flows like water - sometimes rushing, sometimes gentle, always moving forward.....',
        duration: '5:00',
        category: 'healing',
        tags: ['healing', 'peace'],
        audioUrl: 'https://storage.googleapis.com/hackuccino.appspot.com/audio/like-waters.mp3',
        transcript: 'Full transcript of the peaceful healing story...',
        metadata: {
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          language: 'en',
          narrator: 'AI Voice 3',
          backgroundMusic: true
        }
      }
    ];

    // Create a batch write
    const batch = db.batch();

    // Add each story to the batch
    stories.forEach(story => {
      const docRef = audioStoriesCollection.doc(story.id);
      batch.set(docRef, story);
    });

    // Initialize Categories Collection
    const categoriesCollection = db.collection('categories');
    const categories = [
      {
        id: 'hope',
        name: 'Hope',
        description: 'Stories that inspire hope and optimism',
        emoji: '⭐',
        color: '#4A90E2',
        storyCount: 1
      },
      {
        id: 'resilience',
        name: 'Resilience',
        description: 'Stories about inner strength and perseverance',
        emoji: '💪',
        color: '#F5A623',
        storyCount: 1
      },
      {
        id: 'community',
        name: 'Community',
        description: 'Stories about connection and support',
        emoji: '🤝',
        color: '#7ED321',
        storyCount: 1
      },
      {
        id: 'healing',
        name: 'Healing',
        description: 'Stories about recovery and finding peace',
        emoji: '🌊',
        color: '#50E3C2',
        storyCount: 1
      }
    ];

    // Add each category to the batch
    categories.forEach(category => {
      const docRef = categoriesCollection.doc(category.id);
      batch.set(docRef, category);
    });

    // Initialize Tags Collection
    const tagsCollection = db.collection('tags');
    const tags = [
      { id: 'resilience', count: 1 },
      { id: 'hope', count: 1 },
      { id: 'strength', count: 1 },
      { id: 'courage', count: 1 },
      { id: 'community', count: 1 },
      { id: 'support', count: 1 },
      { id: 'healing', count: 1 },
      { id: 'peace', count: 1 }
    ];

    // Add each tag to the batch
    tags.forEach(tag => {
      const docRef = tagsCollection.doc(tag.id);
      batch.set(docRef, tag);
    });

    // Initialize User Interaction Collection (for analytics)
    const analyticsCollection = db.collection('analytics');
    const analyticsDocs = {
      'story-plays': {
        totalPlays: 0,
        playsByStory: {},
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      },
      'user-engagement': {
        totalListeningTime: 0,
        averageListeningDuration: 0,
        completionRate: 0,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      }
    };

    // Add analytics docs to the batch
    Object.entries(analyticsDocs).forEach(([docId, data]) => {
      const docRef = analyticsCollection.doc(docId);
      batch.set(docRef, data);
    });

    // Commit the batch
    await batch.commit();
    console.log('✅ Successfully initialized all collections!');

    // Verify the data
    const storiesSnapshot = await audioStoriesCollection.get();
    console.log(`📚 Created ${storiesSnapshot.size} stories`);
    
    const categoriesSnapshot = await categoriesCollection.get();
    console.log(`🏷️  Created ${categoriesSnapshot.size} categories`);
    
    const tagsSnapshot = await tagsCollection.get();
    console.log(`🔖 Created ${tagsSnapshot.size} tags`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeCollections();
