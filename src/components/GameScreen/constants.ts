export const START_POSITION_X = 0;
export const START_POSITION_Y = 0;
export const MAX_MOVES = 25;

export const stepXCoefficient: Record<number, { x: number, y: number }> = {
  1000: { x: 0.775, y: 0.365 },
  1200: { x: 0.820, y: 0.387 },
  1300: { x: 0.889, y: 0.420 },
  1400: { x: 0.808, y: 0.382 },
  1500: { x: 0.865, y: 0.409 },
  1600: { x: 0.92, y: 0.435 },
  1700: { x: 0.98, y: 0.463 },
  1800: { x: 1.05, y: 0.496 },
  1900: { x: 1.06, y: 0.5 },
  2000: { x: 1.11, y: 0.524 },
  2100: { x: 1.15, y: 0.544 },
  2200: { x: 1.23, y: 0.5799 },
  2300: { x: 1.28, y: 0.6055 },
  2400: { x: 1.34, y: 0.633 },
  2500: { x: 1.39, y: 0.656 },
  2600: { x: 1.5, y: 0.708 },
  2700: { x: 1.59, y: 0.75 },
  2800: { x: 1.64, y: 0.775 },
  2900: { x: 1.69, y: 0.796 },
  3000: { x: 1.73, y: 0.817 },
  3100: { x: 1.78, y: 0.8395 },
  3200: { x: 1.83, y: 0.862 },
  3300: { x: 1.87, y: 0.882 },
  3400: { x: 1.92, y: 0.905 },
  3500: { x: 1.96, y: 0.926 },
  3600: { x: 2, y: 0.942 },
}

export const getStepXCoefficient = (width: number): { x: number, y: number } => {
  const keys = Object.keys(stepXCoefficient).map(Number);
  const validKeys = keys.filter(key => key <= width);

  if (validKeys.length === 0) {
    return { x: 2, y: 0.94 };
  }

  const closestKey = Math.max(...validKeys);
  return stepXCoefficient[closestKey];
};