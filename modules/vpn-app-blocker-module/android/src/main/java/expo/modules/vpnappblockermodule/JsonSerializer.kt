package expo.modules.vpnappblockermodule

// utils/JsonSerializer.kt
import org.json.JSONArray
import org.json.JSONObject

object JsonSerializer {
  fun serialize(data: List<Map<String, Any?>>): String {
    val jsonArray = JSONArray()
    data.forEach { item ->
      jsonArray.put(JSONObject(item))
    }
    return jsonArray.toString()
  }

  fun deserialize(json: String): List<Map<String, Any?>> {
    val jsonArray = JSONArray(json)
    return List(jsonArray.length()) { i ->
      val obj = jsonArray.getJSONObject(i)
      obj.keys().asSequence().associateWith { key -> obj.get(key) }
    }
  }
}