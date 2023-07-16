export default function capitalize(word: string): string {
  const firstLetter = word.charAt(0).toUpperCase();
  const otherLetters = word.slice(1);

  return `${firstLetter}${otherLetters}`;
}
