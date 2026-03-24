// VpnAppBlockerModule.web.ts
import { NativeModule, registerWebModule } from "expo";
import {
  VpnAppBlockerModuleEvents,
  VpnPermissionResult,
} from "./VpnAppBlockerModule.types";

class VpnAppBlockerModule extends NativeModule<VpnAppBlockerModuleEvents> {
  async checkVpnPermission(): Promise<VpnPermissionResult> {
    // VPN is not applicable on web — return as already granted
    return { intent: "null", action: "null" };
  }

  async requestVpnPermission(): Promise<boolean> {
    // VPN is not applicable on web — no-op
    return true;
  }
}

export default registerWebModule(VpnAppBlockerModule, "VpnAppBlockerModule");
