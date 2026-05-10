import { NativeModule, requireNativeModule } from "expo";

import { AppItem } from "@/app/create-capsule/app-drawer/types";
import { AppListModuleEvents } from "./AppListModule.types";

declare class AppListModule extends NativeModule<AppListModuleEvents> {
  getInstalledApps(): Promise<AppItem[]>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AppListModule>("AppListModule");
