# UNI System Architecture – CGEI Engine

This document outlines the technical architecture for UNI — the first Conversational Generative Emotion Interface (CGEI). The goal is to define how text, emotion, AI, and generative art work together in real-time to power the UNI experience.

---

## 🧭 Core Flow: Message → Emotion → Output


---

## ⚙️ Stack Overview

| Layer | Tool / API | Purpose |
|-------|------------|---------|
| Frontend | Flutter OR React Native | Cross-platform mobile UI (iOS + Android) |
| Realtime DB | Firebase / Supabase | Messaging, auth, presence |
| Emotion Analysis | Google Cloud Natural Language | Detects sentiment & emotion |
| LLM Response | OpenAI GPT-4 | Drives UNI persona’s voice |
| Visual Generation | DALL·E OR Stable Diffusion | Generates full-screen scenes, memory visuals |
| Audio Generation | Google Cloud TTS (optional) | Spoken UNI responses |
| Canvas Animation | WebGL, Unity, or p5.js | Bubble morphing, ambient animation |

---

## 💬 1. Realtime Messaging Core

- Built on Firebase or Supabase  
- Stores messages with timestamps, user ID, and emotion metadata
- Listens to incoming message events to trigger downstream reactions

---

## 🧠 2. Emotion Detection Pipeline

- Incoming messages sent to Google NLP API
- Returns:
  - Sentiment Score (–1.0 to +1.0)
  - Emotion Labels (joy, anger, sadness, etc.)
  - Key Phrases / Entities
- Triggers:
  - Visual scene generation
  - Bubble animation effects
  - UNI tone modulation

---

## 🎭 3. UNI Persona (LLM Response)

- GPT-4 generates brief, in-character responses after each message
- Prompt includes:
  - Recent messages (limited history)
  - Sentiment metadata
  - Personality description (cheerful, supportive, witty)
- Configurable temperature for tone

---

## 🖼 4. Generative Art Engine

**For backgrounds:**
- Text-to-image model (DALL·E or SDXL) generates ambient scene
- Input prompt blends:
  - Detected emotion
  - Contextual keywords
  - Conversation theme

**For story cards:**
- Chat + photo → narrative caption + visual scene
- Outputs are stored in Memory Deck

---

## 💬 5. Morphing Chat Bubbles

- Built using:
  - WebGL custom shaders, OR
  - Unity particle system overlay
- Visuals adapt based on:
  - Message emotion
  - Message type (text, photo, celebration)
  - User actions (save, long-press, tap)

---

## 🔈 6. Optional Voice Layer

- Google Cloud TTS  
- UNI lines converted to audio (animated lips / sound waves optional)
- Users can toggle ON/OFF in settings

---

## 🛡️ 7. Privacy & Safety

- End-to-end encrypted chat (Firebase + optional Signal Protocol)
- Memory Cards are stored privately (not public)
- No data is used to train models
- UNI does not store permanent chat logs beyond user-owned content

---

## 🧪 Dev Approach

- MVP targets lean: ~4-week build with async loading + cloud APIs
- Heavy lifting done by cloud (DALL·E, NLP, LLM)
- Frontend modular: emotion UI separated from core messaging

---

## 📈 Scaling Plan (Post-MVP)

- Migrate AI components to on-device models (LLM + image)
- Cache visuals for smoother UX
- Add usage analytics (privacy-safe)
- Explore local rendering for morphing effects

---

## 🧠 Summary

UNI combines AI, emotion, and generative art into a real-time communication engine.  
By structuring every message as an input to sentiment, scene, and character pipelines, UNI builds a dynamic, emotionally intelligent interface — the foundation of CGEI.

