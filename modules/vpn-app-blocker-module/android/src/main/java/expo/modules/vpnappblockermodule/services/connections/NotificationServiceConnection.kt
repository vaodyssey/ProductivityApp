package expo.modules.vpnappblockermodule.services.connections

import android.content.ComponentName
import android.content.ServiceConnection
import android.os.Build
import android.os.IBinder
import androidx.annotation.RequiresApi
import expo.modules.vpnappblockermodule.services.NotificationService

@RequiresApi(Build.VERSION_CODES.Q)
object NotificationServiceConnection : ServiceConnection {
  var isNotificationServiceBound = false;
  lateinit var notificationService: NotificationService
  override fun onServiceConnected(p0: ComponentName?, p1: IBinder?) {
    // This is called when the connection with the service has been
    // established, giving us the service object we can use to
    // interact with the service.  Because we have bound to a explicit
    // service that we know is running in our own process, we can
    // cast its IBinder to a concrete class and directly access it.
    val binder = p1 as NotificationService.NotificationServiceBinder
    notificationService = binder.getService()
    isNotificationServiceBound = true; // Service is now bound and ready
  }

  override fun onServiceDisconnected(p0: ComponentName?) {
    // This is called when the connection with the service has been
    // unexpectedly disconnected -- that is, its process crashed.
    // Because it is running in our same process, we should never
    // see this happen.
    isNotificationServiceBound = false; // Service is now bound and ready
  }
}