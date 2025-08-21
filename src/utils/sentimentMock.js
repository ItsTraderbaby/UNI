// src/utils/sentimentMock.js
// Anchors: [UNI:LISTS] [UNI:FUNC]

// [UNI:LISTS]
const HAPPY_WORDS = [
  'love','adore','loved','loving','yay','joy','happy','happiness','great','awesome',
  'wonderful','amazing','sweet','kiss','hugs','hug','sunshine','grateful','smile','smiling',
  'laughter','lol','haha','hehe','xoxo','proud','blessed','excited','stoked','❤️','😊','😍'
];

const SAD_WORDS = [
  'sad','sorrow','cry','crying','tears','tearful','lonely','miss','missing','broken',
  'hurt','blue','down','depressed','grief','unhappy','upset','mourning','sigh','tired',
  'exhausted','anxious','worry','worried','hopeless','melancholy','downcast','😢','😞','💔'
];

const ANGRY_WORDS = [
  'angry','mad','furious','rage','annoyed','pissed','hate','argument','argue','fight',
  'irritated','fuming','grrr','yelling','shouting','caps','!!!','frustrated','frustration','ticked',
  'conflict','blame','jealous','resent','snapped','snippy','rude','hostile','😡','🤬'
];

// [UNI:FUNC]
export const getSentiment = (text) => {
  if (!text) return 'neutral';
  const t = text.toLowerCase();
  const has = (list) => list.some(w => t.includes(w));
  if (has(HAPPY_WORDS)) return 'happy';
  if (has(SAD_WORDS)) return 'sad';
  if (has(ANGRY_WORDS)) return 'angry';
  return 'neutral';
};