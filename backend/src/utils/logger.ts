const getTimestamp = (): string => new Date().toISOString();

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] [${getTimestamp()}] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] [${getTimestamp()}] ${message}`, ...args);
  },
  error: (error: Error | string, ...args: any[]) => {
    const message = error instanceof Error ? error.stack : error;
    console.error(`[ERROR] [${getTimestamp()}] ${message}`, ...args);
  },
};
