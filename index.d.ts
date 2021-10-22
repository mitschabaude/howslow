export { howSlow as default };

declare function howSlow(
  name: string,
  run: (
    start: (label?: string) => void,
    stop: (label?: string) => void
  ) => void,
  options: {
    numberOfRuns: number;
    numberOfWarmups: number;
  }
): Promise<void>;
