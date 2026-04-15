package expo.modules.vpnappblockermodule

import android.content.Context
import android.content.Intent
import android.net.VpnService

import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition


class VpnAppBlockerModule : Module() {
  override fun definition() = ModuleDefinition {
    var vpnPermissionPromise: Promise? = null
    val REQUEST_CODE_VPN_PERMISSION = 0x0F00
    val serviceConnection = VpnAppBlockerServiceConnection(appContext)
    val ACTION_STOP = "expo.modules.vpnappblockermodule.STOP"
    Name("VpnAppBlockerModule")
    AsyncFunction("checkVpnPermission") { promise: Promise ->
      val context: Context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
      val intent = VpnService.prepare(context)
      promise.resolve(intent?.action)
    }
    AsyncFunction("requestVpnPermission") { promise: Promise ->
      val context: Context = appContext.reactContext ?: throw Exceptions.ReactContextLost()

      // Fast-path: permission already granted — no dialog needed
      val prepareIntent = VpnService.prepare(context)
      if (prepareIntent == null) {
        promise.resolve(true)
        return@AsyncFunction
      }

      // We need a live Activity to call startActivityForResult
      val activity =
        appContext.activityProvider?.currentActivity
          ?: run {
            promise.reject(
              "NO_ACTIVITY",
              "No foreground Activity is available to present the VPN consent dialog.",
              null
            )
            return@AsyncFunction
          }

      // Guard against concurrent calls
      if (vpnPermissionPromise != null) {
        promise.reject(
          "ALREADY_REQUESTING",
          "A VPN permission request is already in progress.",
          null
        )
        return@AsyncFunction
      }

      // Park the Promise — activityResultListener will resolve it
      vpnPermissionPromise = promise
      activity.startActivityForResult(prepareIntent, REQUEST_CODE_VPN_PERMISSION)
    }
    AsyncFunction("startVpn") { blacklistedPackages: List<String>, promise: Promise ->
      try {
        val context: Context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
        if (VpnService.prepare(context) != null) {
          promise.reject(
            "VPN_PERMISSION_REQUIRED",
            "VPN permission has not been granted. Call requestVpnPermission() first.",
            null
          )
          return@AsyncFunction
        }

      val serviceIntent = Intent(context, VpnAppBlockerService::class.java)
      context.startService(serviceIntent)
        promise.resolve(true)
      } catch (e: Exception) {
        promise.resolve(false)
      }
    }

  }
}
