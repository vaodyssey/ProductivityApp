package expo.modules.vpnappblockermodule

import android.app.AppOpsManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.VpnService
import android.os.Build
import android.os.IBinder
import android.os.ParcelFileDescriptor
import android.os.Process
import android.provider.Settings
import android.util.Log
import androidx.annotation.RequiresApi
import java.io.FileInputStream
import java.io.FileOutputStream
import java.net.InetSocketAddress


/**
https://medium.com/@satish.nada98/complete-guide-to-implementing-a-vpn-service-in-android-exploring-development-details-with-code-96683c834d8d
 **/

@RequiresApi(Build.VERSION_CODES.Q)
class VpnAppBlockerService : VpnService() {
  private val TAG = "VpnAppBlockerService"

  private lateinit var vpnThread: Thread
  private lateinit var vpnInterface: ParcelFileDescriptor // a unique, non-negative number
  private var notificationService: NotificationService? = null
  private val notificationServiceConnection = object: ServiceConnection {
    override fun onServiceConnected(p0: ComponentName?, p1: IBinder?) {
      // This is called when the connection with the service has been
      // established, giving us the service object we can use to
      // interact with the service.  Because we have bound to a explicit
      // service that we know is running in our own process, we can
      // cast its IBinder to a concrete class and directly access it.
      val binder: NotificationService.NotificationServiceBinder =
        p1 as NotificationService.NotificationServiceBinder
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
  private var isNotificationServiceBound = false;

  private var extractPkgNameFromBufferService: ExtractPkgNameFromBufferService? = null
  private val extractPkgNameFromBufferServiceConnection = object: ServiceConnection {
    override fun onServiceConnected(p0: ComponentName?, p1: IBinder?) {
      val binder: ExtractPkgNameFromBufferService.ExtractPkgNameFromBufferServiceBinder =
        p1 as ExtractPkgNameFromBufferService.ExtractPkgNameFromBufferServiceBinder
      extractPkgNameFromBufferService = binder.getService()
      isExtractPkgNameFromBufferServiceBound = true; // Service is now bound and ready
    }

    override fun onServiceDisconnected(p0: ComponentName?) {
      isExtractPkgNameFromBufferServiceBound = false; // Service is now bound and ready
    }
  }
  private var isExtractPkgNameFromBufferServiceBound = false;

  override fun onCreate() {
    super.onCreate()
    val notifServiceIntent = Intent(this, NotificationService::class.java)
    bindService(notifServiceIntent, notificationServiceConnection, Context.BIND_AUTO_CREATE)

    val extractPkgNameServiceIntent = Intent(this, ExtractPkgNameFromBufferService::class.java)
    bindService(extractPkgNameServiceIntent, extractPkgNameFromBufferServiceConnection, Context.BIND_AUTO_CREATE)
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    val action = intent?.getStringExtra("action")
    if(action.equals("START_VPN")) startVpn()
    return START_STICKY
  }

  private val notifiedPackages = mutableSetOf<String>()

  fun startVpn() {
    notificationService?.createOveruseNotificationChannel()
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

        while (true) {
          // Block until a packet arrives, then discard it
          val length = vpnInput.read(buffer)
          if (length > 0) {
            val packageName = extractPkgNameFromBufferService?.getPackageFromBuffer(buffer, length) ?: continue
            notificationService?.sendOveruseNotification(packageName)
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
}


