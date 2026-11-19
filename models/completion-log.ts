export interface CompletionLog {
  id: string;
  dateTime: string;
  completed: boolean;
  capsuleId: string;
}

export interface CompletionLogWithImage {
  id: string;
  dateTime: string;
  completed: number | boolean;
  goodHabitName: string;
  goodImageUrl: string;
  completionRate: number;
}
