// Reexport the native module. On web, it will be resolved to AppListModule.web.ts
// and on native platforms to AppListModule.ts
export { default } from "./src/AppListModule";
export * from "./src/AppListModule.types";

