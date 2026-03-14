// Reexport the native module. On web, it will be resolved to AppListModule.web.ts
// and on native platforms to AppListModule.ts
export { default } from './src/AppListModule';
export { default as AppListModuleView } from './src/AppListModuleView';
export * from  './src/AppListModule.types';
