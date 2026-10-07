package expo.modules.vpnappblockermodule

import android.content.Context
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.ParcelFileDescriptor
import android.util.Log
import androidx.annotation.RequiresApi
import expo.modules.vpnappblockermodule.entities.Capsule
import expo.modules.vpnappblockermodule.services.ExtractPkgNameFromBufferService
import expo.modules.vpnappblockermodule.services.NotificationService
import expo.modules.vpnappblockermodule.services.connections.ExtractPkgNameFromBufferServiceConnection
import expo.modules.vpnappblockermodule.services.connections.NotificationServiceConnection
import expo.modules.vpnappblockermodule.utils.JsonSerializer
import java.io.FileInputStream


/**
https://medium.com/@satish.nada98/complete-guide-to-implementing-a-vpn-service-in-android-exploring-development-details-with-code-96683c834d8d
 **/

@RequiresApi(Build.VERSION_CODES.Q)
class VpnAppBlockerService : VpnService() {
  private val TAG = "VpnAppBlockerService"
  private lateinit var vpnThread: Thread
  private lateinit var vpnInterface: ParcelFileDescriptor // a unique, non-negative number
  private lateinit var notificationService: NotificationService
  private lateinit var extractPkgNameFromBufferService: ExtractPkgNameFromBufferService


  override fun onCreate() {
    super.onCreate()
    Intent(this, NotificationService::class.java).also { intent ->
      bindService(intent, NotificationServiceConnection, BIND_AUTO_CREATE)
    }

    Intent(this, ExtractPkgNameFromBufferService::class.java).also { intent ->
      bindService(
        intent,
        ExtractPkgNameFromBufferServiceConnection,
        Context.BIND_AUTO_CREATE
      )
    }
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (NotificationServiceConnection.isNotificationServiceBound)
      notificationService = NotificationServiceConnection.notificationService

    if (ExtractPkgNameFromBufferServiceConnection.isExtractPkgNameFromBufferServiceBound)
      extractPkgNameFromBufferService =
        ExtractPkgNameFromBufferServiceConnection.extractPkgNameFromBufferService
    val action = intent?.getStringExtra("action")
    val json = intent?.getStringExtra("blacklistedPackages") ?: return START_NOT_STICKY
    if (action.equals("START_VPN")) startVpn(json)
    return START_STICKY
  }

  private val notifiedPackages = mutableSetOf<String>()

  fun startVpn(blacklistedPackagesString: String) {
    val result = JsonSerializer.deserialize(blacklistedPackagesString)
    val blacklistedPackages = result.map { map ->
      Capsule(
        id = map["id"] as Int,
        badHabitName = map["badHabitName"] as String,
        appPackageName = map["appPackageName"] as String,
        imageUrl = map["imageUrl"] as String,
      )
    }
    notificationService.createOveruseNotificationChannel()
    vpnThread = Thread {
      val builder = Builder()

      builder.setSession("ProductivityApp")
        .addAddress("10.0.0.1", 24)
        .addRoute("0.0.0.0", 0)
        .setMtu(1500)

      blacklistedPackages.forEach { capsule ->
        builder.addAllowedApplication(capsule.appPackageName)
      }

      vpnInterface = builder.establish()!!

      val vpnInput = FileInputStream(vpnInterface.fileDescriptor)
      val buffer = ByteArray(32767)

      while (true) {
        val length = vpnInput.read(buffer)
        if (length > 0
        ) {
          val packageName =
            extractPkgNameFromBufferService.getPackageFromBuffer(buffer, length) ?: continue
          val matchedCapsule = blacklistedPackages.find { it.appPackageName == packageName }

          notificationService.sendOveruseNotification(packageName, matchedCapsule?.imageUrl)
          notifiedPackages.add(packageName)
          Log.v(TAG, "Packet from: $packageName — $length bytes (black-holed)")
          Log.v(TAG, "Discarded $length bytes (packet black-holed)")
        }
      }
    }
    vpnThread.start()
  }

  private fun stopVpn() {
    try {
      vpnInterface.close()
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }
}


