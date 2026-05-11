import { SCALED_FONT_SIZE, SCALED_LINE_HEIGHT } from "@/utils/text";
import { StyleSheet } from "react-native";

const FONT_STYLES = StyleSheet.create({
  H1_STYLE: {
    fontSize: SCALED_FONT_SIZE(24),
    fontWeight: "bold",
  },
  H2_STYLE: {
    fontSize: SCALED_FONT_SIZE(22),
    fontWeight: "bold",
  },
  H3_STYLE: {
    fontSize: SCALED_FONT_SIZE(18),
    fontWeight: "bold",
  },
  H4_STYLE: {
    fontSize: SCALED_FONT_SIZE(16),
    fontWeight: "600",
  },
  H5_STYLE: {
    fontSize: SCALED_FONT_SIZE(15),
    fontWeight: "600",
  },
  H6_STYLE: {
    fontSize: SCALED_FONT_SIZE(14),
    fontWeight: "normal",
  },
  BODY_STYLE: {
    fontSize: SCALED_FONT_SIZE(16),
    lineHeight: SCALED_LINE_HEIGHT(16),
  },
  PARAGRAPH_STYLE: {
    fontSize: SCALED_FONT_SIZE(14),
    lineHeight: SCALED_LINE_HEIGHT(14),
  },
  CAPTION_STYLE: {
    fontSize: SCALED_FONT_SIZE(12),
    lineHeight: SCALED_LINE_HEIGHT(12),
    fontWeight: "normal",
  },
  LABEL_STYLE: {
    fontSize: SCALED_FONT_SIZE(12),
    fontWeight: "600",
  },
  OVERLINE_STYLE: {
    fontSize: SCALED_FONT_SIZE(10),
    fontWeight: "600",
    letterSpacing: 1.2,
  },
});

export default FONT_STYLES;
