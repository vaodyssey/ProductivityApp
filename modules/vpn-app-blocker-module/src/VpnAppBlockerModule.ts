// VpnAppBlockerModule.ts
import { NativeModule, requireNativeModule } from "expo";
import {
  VpnAppBlockerModuleEvents,
  VpnPermissionResult,
} from "./VpnAppBlockerModule.types";

declare class VpnAppBlockerModule extends NativeModule<VpnAppBlockerModuleEvents> {
  checkVpnPermission(): Promise<VpnPermissionResult>;
  requestVpnPermission(): Promise<boolean>;
  startVpn(blacklistedPackages: string[]): Promise<boolean>;
  stopVpn(): Promise<boolean>;
}

export default requireNativeModule<VpnAppBlockerModule>("VpnAppBlockerModule");
