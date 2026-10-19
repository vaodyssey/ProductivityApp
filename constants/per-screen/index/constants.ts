import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import { Capsule } from "@/models/capsule";

export const PROGRESS_BUDDY_PHRASE = "You've got this sweetie!";

export const PROGRESS_BUDDY_HINT = "Swipe Up for More";

export const SCROLL_FADE_RANGE = 300;

export const TOP_HABITS_COUNT = 3;

export const MOCK_CAPSULES: Capsule[] = [
  {
    id: "CS_0001",
    badHabitName: "Read Atomic Habits",
    appPackageName: "com.mock.atomic",
    imageUrl: "",
    completedThisWeek: 5,
    weeklyGoal: 5,
  },
  {
    id: "CS_0002",
    badHabitName: "Go Jogging",
    appPackageName: "com.mock.jogging",
    imageUrl: "",
    completedThisWeek: 4,
    weeklyGoal: 10,
  },
  {
    id: "CS_0003",
    badHabitName: "Meditate",
    appPackageName: "com.mock.meditate",
    imageUrl: "",
    completedThisWeek: 3,
    weeklyGoal: 3,
  },
  {
    id: "CS_0004",
    badHabitName: "Drink Water",
    appPackageName: "com.mock.water",
    imageUrl: "",
    completedThisWeek: 2,
    weeklyGoal: 5,
  },
  {
    id: "CS_0005",
    badHabitName: "Read Books",
    appPackageName: "com.mock.books",
    imageUrl: "",
    completedThisWeek: 2,
    weeklyGoal: 6,
  },
];

export const HABIT_CARD_WIDTH = SCREEN_WIDTH * 0.8;
export const HABIT_CARD_HEIGHT = SCREEN_HEIGHT * 0.45;

export const GAP_BETWEEN_HABIT_CARDS = 0.01;
export const FLATLIST_SNAP_INTERVAL =
  HABIT_CARD_HEIGHT + GAP_BETWEEN_HABIT_CARDS;
