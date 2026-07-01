Nursing Roadmap with Firebase Sync

This version syncs checkmarks across Mac/phone using Google Sign-In + Firestore.

SETUP:
1. Go to https://console.firebase.google.com
2. Create a project.
3. Project Overview > Web app icon </> > Register app.
4. Copy the firebaseConfig object into firebase-config.js.
5. Authentication > Sign-in method > Google > Enable.
6. Firestore Database > Create database.
   - Start in production mode if you will add the rules below.
   - Or test mode temporarily.
7. Firestore Rules: paste firestore.rules contents and publish.
8. Upload these files to your GitHub repo:
   - index.html
   - style.css
   - script.js
   - firebase-config.js
   - README.txt
   - firestore.rules (optional, just for reference)
9. GitHub Pages will serve it.
10. Open the site, sign in with Google, and checkmarks will sync.

NOTE:
Firebase web config is okay to be public. Security comes from Firestore rules and Authentication.
