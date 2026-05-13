import { Capsule } from "@/models/Capsule";

export const DEFAULT_CAPSULE: Capsule = {
  id: undefined,
  badHabitName: "",
  appPackageName: "",
  imageUrl: "",
};

export enum CapsuleFormMode {
  EDIT,
  CREATE,
}
