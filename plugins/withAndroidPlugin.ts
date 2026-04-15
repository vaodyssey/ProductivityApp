import { ConfigPlugin, withAndroidManifest } from "expo/config-plugins";

const withAndroidPlugin: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config?.modResults?.manifest?.application?.[0];

    if (mainApplication) {
      if (!mainApplication["service"]) {
        mainApplication["service"] = [];
      }

      mainApplication["service"].push({
        $: {
          "android:name":
            "expo.modules.vpnappblockermodule.VpnAppBlockerService",
          "android:exported": "false",
          "android:permission": "android.permission.BIND_VPN_SERVICE",
        },
        "intent-filter": [
          {
            action: [
              {
                $: {
                  "android:name": "android.net.VpnService",
                },
              },
            ],
          },
        ],
      });
    }

    return config;
  });
};

export default withAndroidPlugin;
