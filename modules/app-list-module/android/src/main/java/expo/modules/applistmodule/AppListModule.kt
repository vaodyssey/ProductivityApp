package expo.modules.applistmodule

import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AppListModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AppListModule")
    AsyncFunction("getInstalledApps") { promise: Promise ->
      // 1. Get Context and PM correctly
      val context: Context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
      val packageManager = context.packageManager

      // 2. Get the list of apps
      val installedPackages: List<ApplicationInfo> =
              packageManager.getInstalledApplications(PackageManager.GET_META_DATA)

      // 3. Map to a friendly JS object with ICON_RES_ID (Integer)
      // Note: icon is null for some system apps, so we check ?.default if needed,
      // but usually 'icon' works fine on modern Android API levels.
      val appsData = mutableListOf<Map<String, Any>>()

      for (info in installedPackages) {
        // Optional: Filter logic here? e.g., if info.packageName != "...", continue

        val appInfoMap =
                mapOf(
                        "appName" to info.loadLabel(packageManager).toString(),
                        "packageName" to info.packageName,
                        // "iconId" to (info.icon?.resId?.packageResId?.toInteger() ?: 0)
                        // "isSystem" to (info.applicationInfo?.flags and
                        // ApplicationInfo.FLAG_SYSTEM != 0)
                        )

        // This is the manual "push":
        appsData.add(appInfoMap)
      }
      // 4. Resolve with the list
      promise.resolve(appsData)
    }
  }
}
