import BottomSheet from "@gorhom/bottom-sheet";
import { RefObject } from "react";

export interface BaseProps {
  ref: RefObject<BottomSheet | null>;
}

export interface AppItem {
  id: string;
  appName: string;
  packageName: string;
  isChecked: boolean;
}
