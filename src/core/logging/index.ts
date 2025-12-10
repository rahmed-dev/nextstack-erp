// Central logger with structured messages.

export type LogLevel = "debug" | "info" | "warn" | "error";

export function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  void context;
  // For now, just log to console; later this will write to workspace logs.
  // eslint-disable-next-line no-console
  console.log(`[${level}] ${message}`);
}

