export interface MoodStatus {
  mood: MascotMood;
  message: string;
  emoji: string;
}
export enum MascotMood {
  HAPPY = "Happy",
  NEUTRAL = "Neutral",
  SAD = "Sad",
}
