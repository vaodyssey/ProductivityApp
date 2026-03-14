import { NativeModule, requireNativeModule } from "expo";

import { AppListModuleEvents } from "./AppListModule.types";

declare class AppListModule extends NativeModule<AppListModuleEvents> {
  getTheme(): string;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AppListModule>("AppListModule");
