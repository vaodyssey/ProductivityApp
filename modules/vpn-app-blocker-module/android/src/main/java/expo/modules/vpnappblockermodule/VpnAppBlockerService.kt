package expo.modules.vpnappblockermodule

import android.content.Intent
import android.net.VpnService

import android.os.ParcelFileDescriptor
import android.util.Log
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.InputStream

/**
https://medium.com/@satish.nada98/complete-guide-to-implementing-a-vpn-service-in-android-exploring-development-details-with-code-96683c834d8d
 **/


class VpnAppBlockerService : VpnService() {
  private lateinit var vpnThread: Thread
  private lateinit var vpnInterface: ParcelFileDescriptor

  override fun onCreate() {
    super.onCreate()
    Log.d("LOLOLOL", "THE SERVICE IS STARTINGGGG")
  // Perform initialization tasks here
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    // Handle connection requests and manage VPN network traffic here
    Log.d("LOLOLOL", "THE SERVICE IS STARTINGGGG")
        startVpn()
    return START_STICKY
  }

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

//        while (true) {
          // Read incoming network traffic from vpnInput
          // Process the traffic as needed
//          logStream(vpnInput)
          // Write outgoing network traffic to vpnOutput
          // Send the traffic through the VPN interface
//        }
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

  private fun logStream(inputStream: InputStream) {
    val tag = "VpnAppBlockerLogger"
    inputStream.bufferedReader().useLines { lines ->
      lines.forEach { line ->
        Log.d(tag, line)
      }
    }
  }

  override fun onDestroy() {
    super.onDestroy()
    // Clean up resources and terminate the VPN connection here
  }
}



