export const PLATFORM_COLORS = {
  "PlayStation 5": "#003087",
  "PlayStation 4": "#003087",
  "PlayStation 3": "#003087",
  "PlayStation 2": "#003087",
  "PlayStation 1": "#003087",
  PlayStation: "#003087",
  "Xbox One": "#107C10",
  "Xbox Series S/X": "#107C10",
  "Xbox 360": "#107C10",
  "Nintendo Switch": "#E4000F",
  "Nintendo 64": "#E4000F",
  "Nintendo DS": "#CC0000",
  "Nintendo 3DS": "#CC0000",
  "Game Boy Advance": "#8B008B",
  "Game Boy Color": "#8B008B",
  "Game Boy": "#8B008B",
  GameCube: "#6A0DAD",
  PC: "#FF6B00",
  iOS: "#555555",
  Android: "#78C257",
  macOS: "#555555",
};

export function getPlatformColor(platform) {
  for (const key of Object.keys(PLATFORM_COLORS)) {
    if (platform.toLowerCase().includes(key.toLowerCase())) {
      return PLATFORM_COLORS[key];
    }
  }
  return "#888888";
}
