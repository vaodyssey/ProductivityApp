package expo.modules.vpnappblockermodule

import android.app.AppOpsManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.usage.NetworkStatsManager
import android.content.Intent
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.VpnService
import android.os.Build

import android.os.ParcelFileDescriptor
import android.provider.Settings
import android.util.Log
import androidx.annotation.RequiresApi
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.InputStream
import java.net.InetSocketAddress
import android.os.Process
import android.content.Context
import androidx.core.app.NotificationCompat


/**
https://medium.com/@satish.nada98/complete-guide-to-implementing-a-vpn-service-in-android-exploring-development-details-with-code-96683c834d8d
 **/


class VpnAppBlockerService : VpnService() {
  private lateinit var vpnThread: Thread
  private lateinit var vpnInterface: ParcelFileDescriptor // a unique, non-negative number
  private val TAG = "VpnAppBlockerService"

  override fun onCreate() {
    super.onCreate()
    createOveruseNotificationChannel()
    if (!isUsageAccessGranted()) {
      val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
      startActivity(intent)
    }
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    // Handle connection requests and manage VPN network traffic here
    Log.d("LOLOLOL", "THE SERVICE IS STARTINGGGG")
    startVpn()
    return START_STICKY
  }
  private val notifiedPackages = mutableSetOf<String>()

  fun startVpn() {

    vpnThread = Thread {
      try {
        // Create a new VPN Builder
        val builder = Builder()

        // Set the VPN parameters
        //TODO: Switch this to getString approach whenever we have time.
        builder.setSession("ProductivityApp")
          .addAddress("10.0.0.1", 24)
          .addRoute("0.0.0.0", 0)
          .setMtu(1500)
          .addAllowedApplication("com.facebook.katana")
        // Establish the VPN connection
        vpnInterface = builder.establish()!!

        // Redirect network traffic through the VPN interface
        val vpnInput = FileInputStream(vpnInterface.fileDescriptor)
        val vpnOutput = FileOutputStream(vpnInterface.fileDescriptor)
        val buffer = ByteArray(32767)

//        while (true) {
        // Read incoming network traffic from vpnInput
        // Process the traffic as needed
//          logStream(vpnInput)
        // Write outgoing network traffic to vpnOutput
        // Send the traffic through the VPN interface
//        }

        while (true) {
          // Block until a packet arrives, then discard it
          val length = vpnInput.read(buffer)
//          checkAppDataUsage()
          if (length > 0) {
            val packageName = getPackageFromBuffer(buffer, length) ?: continue
            sendOveruseNotification(packageName)
            notifiedPackages.add(packageName)
            Log.v(TAG, "Packet from: $packageName — $length bytes (black-holed)")
            Log.v(TAG, "Discarded $length bytes (packet black-holed)")
          }
        }
      } catch (e: Exception) {
        // Handle VPN connection errors
        e.printStackTrace()
      } finally {
//        stopVpn()
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

  private data class PacketInfo(
    val protocol: Int,
    val sourceIp: String,
    val destIp: String,
    val sourcePort: Int,
    val destPort: Int
  )

  //SECOND METHOD: Using getConnectionOwnerUid (for Android 10 and above)
  private fun parsePacketInfo(buffer: ByteArray, length: Int): PacketInfo? {
    if (length < 20) return null

    val ipVersion = (buffer[0].toInt() shr 4) and 0xF
    if (ipVersion != 4) return null

    val protocol = buffer[9].toInt() and 0xFF
    if (protocol != 6 && protocol != 17) return null // TCP or UDP only

    val sourceIp = "%d.%d.%d.%d".format(
      buffer[12].toInt() and 0xFF,
      buffer[13].toInt() and 0xFF,
      buffer[14].toInt() and 0xFF,
      buffer[15].toInt() and 0xFF
    )

    val destIp = "%d.%d.%d.%d".format(
      buffer[16].toInt() and 0xFF,
      buffer[17].toInt() and 0xFF,
      buffer[18].toInt() and 0xFF,
      buffer[19].toInt() and 0xFF
    )

    val ihl = (buffer[0].toInt() and 0xF) * 4
    if (length < ihl + 4) return null

    val sourcePort = ((buffer[ihl].toInt() and 0xFF) shl 8) or
            (buffer[ihl + 1].toInt() and 0xFF)
    val destPort   = ((buffer[ihl + 2].toInt() and 0xFF) shl 8) or
            (buffer[ihl + 3].toInt() and 0xFF)

    return PacketInfo(protocol, sourceIp, destIp, sourcePort, destPort)
  }

  // -------------------------------------------------------------------------
// Step 2: Use getConnectionOwnerUid() to resolve packet → UID → package
// -------------------------------------------------------------------------
//  @RequiresApi(Build.VERSION_CODES.Q)
  private fun getPackageFromBuffer(buffer: ByteArray, length: Int): String? {
    val packetInfo = parsePacketInfo(buffer, length) ?: return null

    val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE)
            as ConnectivityManager

    return try {
      val uid = connectivityManager.getConnectionOwnerUid(
        packetInfo.protocol,
        InetSocketAddress(packetInfo.sourceIp, packetInfo.sourcePort),
        InetSocketAddress(packetInfo.destIp, packetInfo.destPort)
      )

      if (uid == Process.INVALID_UID) {
        Log.w(TAG, "No owner found for packet — uid is INVALID_UID")
        return null
      }

      val packageName = packageManager.getPackagesForUid(uid)?.firstOrNull()
      Log.d(TAG, "Packet owner: $packageName (uid=$uid)")
      packageName

    } catch (e: Exception) {
      Log.e(TAG, "getConnectionOwnerUid failed: ${e.message}")
      null
    }
  }

  private fun isUsageAccessGranted(): Boolean {
    return try {
      val packageManager = applicationContext.packageManager
      val applicationInfo = packageManager.getApplicationInfo(packageName, 0)
      val appOpsManager = getSystemService(APP_OPS_SERVICE) as AppOpsManager

      val mode = appOpsManager.checkOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        applicationInfo.uid,
        applicationInfo.packageName
      )

      mode == AppOpsManager.MODE_ALLOWED
    } catch (e: PackageManager.NameNotFoundException) {
      false
    }
  }
  // -------------------------------------------------------------------------
// Call this once during onCreate() to register the channel
// -------------------------------------------------------------------------
  companion object {
    private const val OVERUSE_NOTIFICATION_CHANNEL_ID = "vpn_overuse_channel"
    private const val OVERUSE_NOTIFICATION_CHANNEL_NAME = "App Usage Alerts"
  }
  private fun createOveruseNotificationChannel() {
    val channel = NotificationChannel(
      OVERUSE_NOTIFICATION_CHANNEL_ID,
      OVERUSE_NOTIFICATION_CHANNEL_NAME,
      NotificationManager.IMPORTANCE_HIGH
    ).apply {
      description = "Alerts when a blocked app attempts to access the internet"
      enableVibration(true)
    }
    val notificationManager = getSystemService(NotificationManager::class.java)
    notificationManager.createNotificationChannel(channel)
  }
  // -------------------------------------------------------------------------
// Send the "are you trying to detach?" notification
// -------------------------------------------------------------------------
  private fun sendOveruseNotification(packageName: String) {
    val appName = try {
      packageManager
        .getApplicationLabel(packageManager.getApplicationInfo(packageName, 0))
        .toString()
    } catch (e: Exception) {
      packageName // fallback to raw package name if label not found
    }

    val notification = NotificationCompat.Builder(this, OVERUSE_NOTIFICATION_CHANNEL_ID)
      .setContentTitle("Hey, are you trying to detach from your desired self?")
      .setContentText("$appName is attempting to access the internet.")
      .setStyle(
        NotificationCompat.BigTextStyle()
          .bigText(
            "$appName is attempting to access the internet.\n\n" +
                    "Stay strong — you set this limit for a reason. 💪"
          )
      )
      .setSmallIcon(android.R.drawable.ic_dialog_alert)
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .setAutoCancel(true)
      .build()

    val notificationManager = getSystemService(NotificationManager::class.java)
    // Use packageName.hashCode() so each blocked app gets its own notification slot
    notificationManager.notify(packageName.hashCode(), notification)
  }

}



