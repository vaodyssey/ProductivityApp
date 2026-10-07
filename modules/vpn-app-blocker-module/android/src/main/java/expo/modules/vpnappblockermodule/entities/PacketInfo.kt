package expo.modules.vpnappblockermodule.entities

class PacketInfo(
  val protocol: Int,
  val sourceIp: String,
  val destIp: String,
  val sourcePort: Int,
  val destPort: Int
)