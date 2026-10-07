package expo.modules.vpnappblockermodule.services.connections

import android.content.ComponentName
import android.content.ServiceConnection
import android.os.Build
import android.os.IBinder
import androidx.annotation.RequiresApi
import expo.modules.vpnappblockermodule.services.ExtractPkgNameFromBufferService

@RequiresApi(Build.VERSION_CODES.Q)
object ExtractPkgNameFromBufferServiceConnection : ServiceConnection {

  var isExtractPkgNameFromBufferServiceBound = false;
  lateinit var extractPkgNameFromBufferService: ExtractPkgNameFromBufferService
  override fun onServiceConnected(p0: ComponentName?, p1: IBinder?) {
    val binder = p1 as ExtractPkgNameFromBufferService.ExtractPkgNameFromBufferServiceBinder
    extractPkgNameFromBufferService = binder.getService()
    isExtractPkgNameFromBufferServiceBound = true; // Service is now bound and ready
  }

  override fun onServiceDisconnected(p0: ComponentName?) {
    isExtractPkgNameFromBufferServiceBound = false; // Service is now bound and ready
  }
}
