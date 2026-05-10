import { ConfigPlugin, withAndroidManifest } from "expo/config-plugins";

type AndroidManifestService = {
  $: {
    "android:name": string;
    "android:exported": string;
    "android:permission"?: string;
  };
  "intent-filter"?: {
    action: {
      $: {
        "android:name": string;
      };
    }[];
  }[];
};

const services: AndroidManifestService[] = [
  {
    $: {
      "android:name": "expo.modules.vpnappblockermodule.VpnAppBlockerService",
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
  },
  {
    $: {
      "android:name": "expo.modules.vpnappblockermodule.NotificationService",
      "android:exported": "false",
      "android:permission": "android.permission.POST_NOTIFICATIONS",
    },
  },
  {
    $: {
      "android:name":
        "expo.modules.vpnappblockermodule.ExtractPkgNameFromBufferService",
      "android:exported": "false",
    },
  },
];

const withAndroidPlugin: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config?.modResults?.manifest?.application?.[0];

    if (mainApplication) {
      if (!mainApplication["service"]) {
        mainApplication["service"] = [];
      }

      services.forEach((service) => {
        const alreadyDeclared = mainApplication["service"].some(
          (s: AndroidManifestService) =>
            s.$["android:name"] === service.$["android:name"],
        );

        if (!alreadyDeclared) {
          mainApplication["service"].push(service);
        }
      });
    }

    return config;
  });
};

export default withAndroidPlugin;
