import { Capsule } from "@/models/capsule";

export const DEFAULT_CAPSULE: Capsule = {
  id: "CS_0001",
  goodHabitName: "",
  badAppPackageName: "",
  goodImageUrl: "",
};

export enum CapsuleFormMode {
  EDIT,
  CREATE,
}

export const BOTTOM_SHEET_SNAP_POINTS = ["80%"];
