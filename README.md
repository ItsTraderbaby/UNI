# •UNI•

## The World’s First Conversational Generative Emotion Interface (CGEI)

---

Welcome to UNI (pronounced “you-n-eye”) — a messaging experience that turns every conversation into living art, powered by emotion, AI, and human connection.

> UNI is not just a chat app.
> It’s a new interface for feeling, remembering, and sharing — where the canvas of every message is finally alive.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Firebase Setup](#firebase-setup)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [MVP Security](#mvp-security)
- [License](#license)

---

## Features

- Real-time chat with partner pairing
- Sentiment analysis and generative emotional backgrounds
- Secure authentication (Firebase Auth)
- Persistent sessions (AsyncStorage)
- Firestore-based chat rooms and messages
- Modern, responsive UI (Expo, React Native, React Native Web)

## Tech Stack

- React Native (Expo)
- React Native Web
- Firebase (Auth, Firestore)
- SonarQube (code quality)
- PropTypes (type safety)

## Setup & Installation

1. **Clone the repo:**

   ```sh
   git clone https://github.com/ItsTraderbaby/UNI.git
   cd UNI
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Install AsyncStorage (for React Native):**

   ```sh
   npm install @react-native-async-storage/async-storage
   ```

4. **Install Expo CLI (if not installed):**

   ```sh
   npm install -g expo-cli
   ```

## Environment Variables

UNI uses Firebase. You must set up your own Firebase project and update `src/firebaseConfig.js` with your credentials:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## Running Locally

Start the development server:

```sh
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or run in your browser (React Native Web).

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Set Firestore rules for MVP (see below)

### Firestore Rules (MVP/dev)

For development, you can use:

```plaintext
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production, use:

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /chatRooms/{roomId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && request.auth.uid in resource.data.members;
      match /messages/{msgId} {
        allow read, create: if request.auth != null &&
          request.auth.uid in get(/databases/$(db)/documents/chatRooms/$(roomId)).data.members;
        allow update, delete: if false;
      }
    }
  }
}
```

## Testing

To run basic tests (add your own in `src/__tests__`):

```sh
npm test
```

## Troubleshooting

- Auth not persisting: Make sure AsyncStorage is installed and used in `firebaseConfig.js`.
- Permission errors: Check your Firestore rules.
- Deprecation warnings: All style and prop deprecations are fixed for MVP.
- Expo issues: Try clearing cache: `npx expo start -c`

## MVP Security

- For MVP, open Firestore rules are OK. For production, restrict access to authenticated users.
- Never commit real Firebase credentials to public repos.

## License

See [LICENSE](LICENSE).
