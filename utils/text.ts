import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";

const IPHONE_8_BASE_WIDTH = 375;
const scale = SCREEN_WIDTH / IPHONE_8_BASE_WIDTH;

export const SCALED_FONT_SIZE = (size: number) => Math.round(size * scale);

export const SCALED_LINE_HEIGHT = (
  fontSize: number,
  multiplier: number = 1.4,
): number => {
  return Math.round(SCALED_FONT_SIZE(fontSize) * multiplier);
};
