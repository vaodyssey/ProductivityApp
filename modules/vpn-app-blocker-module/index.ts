// Reexport the native module. On web, it will be resolved to VpnAppBlockerModule.web.ts
// and on native platforms to VpnAppBlockerModule.ts
export { default } from "./src/VpnAppBlockerModule";
export * from "./src/VpnAppBlockerModule.types";

