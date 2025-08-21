// src/utils/uniQuipMock.js
// Anchors: [UNI:FUNC]

export function getUNIQuip(userText = '') {
  const t = userText.toLowerCase();
  const picks = [];

  if (t.includes('love') || t.includes('❤️')) picks.push('Noted. Love levels rising ❤️');
  if (t.includes('sorry')) picks.push('A little empathy goes a long way.');
  if (t.includes('lol') || t.includes('haha') || t.includes('hehe')) picks.push('Giggles logged. Carry on 😄');
  if (t.includes('miss')) picks.push('Distance can’t stop a good story.');
  if (t.includes('angry') || t.includes('mad')) picks.push('Deep breath. 4 seconds in… 6 seconds out.');

  if (!picks.length) return null;
  if (Math.random() < 0.5) return null; // keep UNI occasional

  return { quip: picks[Math.floor(Math.random() * picks.length)] };
}
