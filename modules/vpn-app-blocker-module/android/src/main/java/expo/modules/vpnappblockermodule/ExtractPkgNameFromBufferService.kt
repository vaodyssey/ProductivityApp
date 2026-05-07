package expo.modules.vpnappblockermodule

import android.app.Service
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.os.Binder
import android.os.Build
import android.os.IBinder
import android.os.Process
import android.util.Log
import androidx.annotation.RequiresApi
import java.net.InetSocketAddress

@RequiresApi(Build.VERSION_CODES.Q)
class ExtractPkgNameFromBufferService : Service() {
  private val TAG = "VpnAppBlockerService"
  private val binder = ExtractPkgNameFromBufferServiceBinder()

  inner class ExtractPkgNameFromBufferServiceBinder : Binder() {
    fun getService(): ExtractPkgNameFromBufferService = this@ExtractPkgNameFromBufferService
  }

  override fun onBind(p0: Intent?): IBinder {
    return binder
  }

  fun getPackageFromBuffer(buffer: ByteArray, length: Int): String? {
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
    val destPort = ((buffer[ihl + 2].toInt() and 0xFF) shl 8) or
            (buffer[ihl + 3].toInt() and 0xFF)

    return PacketInfo(protocol, sourceIp, destIp, sourcePort, destPort)
  }
}