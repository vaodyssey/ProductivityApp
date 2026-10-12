import { Capsule } from "@/models/capsule";

export const PROGRESS_BUDDY_PHRASE = "You've got this sweetie!";

export const PROGRESS_BUDDY_HINT = "Swipe Up for More";

export const SCROLL_FADE_RANGE = 300;

export const TOP_HABITS_COUNT = 3;

export const MOCK_CAPSULES: Capsule[] = [
  {
    id: 1,
    badHabitName: "Read Atomic Habits",
    appPackageName: "com.mock.atomic",
    imageUrl: "",
    completedThisWeek: 5,
  },
  {
    id: 2,
    badHabitName: "Go Jogging",
    appPackageName: "com.mock.jogging",
    imageUrl: "",
    completedThisWeek: 4,
  },
  {
    id: 3,
    badHabitName: "Meditate",
    appPackageName: "com.mock.meditate",
    imageUrl: "",
    completedThisWeek: 3,
  },
  {
    id: 4,
    badHabitName: "Drink Water",
    appPackageName: "com.mock.water",
    imageUrl: "",
    completedThisWeek: 2,
  },
  {
    id: 5,
    badHabitName: "Read Books",
    appPackageName: "com.mock.books",
    imageUrl: "",
    completedThisWeek: 2,
  },
];
