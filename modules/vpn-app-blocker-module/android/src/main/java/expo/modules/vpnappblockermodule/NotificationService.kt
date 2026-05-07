package expo.modules.vpnappblockermodule

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Binder
import android.os.Build
import android.os.IBinder
import androidx.annotation.RequiresApi
import androidx.core.app.NotificationCompat


@RequiresApi(Build.VERSION_CODES.O)

class NotificationService : Service() {
  private val OVERUSE_NOTIFICATION_CHANNEL_ID = "vpn_overuse_channel"
  private val OVERUSE_NOTIFICATION_CHANNEL_NAME = "App Usage Alerts"
  private val binder = NotificationServiceBinder()
  inner class NotificationServiceBinder : Binder() {

    fun getService(): NotificationService = this@NotificationService
  }

  override fun onBind(p0: Intent?): IBinder {
    return binder
  }

  fun createOveruseNotificationChannel() {
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

  fun sendOveruseNotification(packageName: String) {
    val appName = try {
      packageManager.getApplicationLabel(packageManager.getApplicationInfo(packageName, 0))
        .toString()
    } catch (e: Exception) {
      packageName // fallback to raw package name if label not found
    }

    val notification = NotificationCompat.Builder(this, OVERUSE_NOTIFICATION_CHANNEL_ID)
      .setContentTitle("Hey, are you trying to detach from your desired self?")
      .setContentText("$appName is attempting to access the internet.").setStyle(
        NotificationCompat.BigTextStyle().bigText(
            "$appName is attempting to access the internet.\n\n" + "Stay strong — you set this limit for a reason. 💪"
          )
      ).setSmallIcon(android.R.drawable.ic_dialog_alert)
      .setPriority(NotificationCompat.PRIORITY_HIGH).setAutoCancel(true).build()

    val notificationManager = getSystemService(NotificationManager::class.java)
    // Use packageName.hashCode() so each blocked app gets its own notification slot
    notificationManager.notify(packageName.hashCode(), notification)
  }

}