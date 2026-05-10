import { ConfigPlugin } from "expo/config-plugins";
import withAndroidPlugin from "./withAndroidPlugin";

const withPlugin: ConfigPlugin = (config) => {
  // Apply Android modifications first
  config = withAndroidPlugin(config);
  // Then apply iOS modifications and return
  return config;
};

export default withPlugin;
