/**
 * Styled console logger for WebLabeler extension
 * Adds colored [WebLabeler] prefix to all log messages
 */

const PREFIX_STYLE = "background: #228be6; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;";
const MESSAGE_STYLE = "color: inherit;";

class Logger {
  private log(level: "log" | "error" | "warn", ...args: unknown[]) {
    console[level]("%c[WebLabeler]%c", PREFIX_STYLE, MESSAGE_STYLE, ...args);
  }

  info(...args: unknown[]) {
    this.log("log", ...args);
  }

  error(...args: unknown[]) {
    this.log("error", ...args);
  }

  warn(...args: unknown[]) {
    this.log("warn", ...args);
  }
}

export const logger = new Logger();
