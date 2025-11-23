/**
 * Configuration reader hooks
 * Provides hooks for reading and validating label configurations from different sources
 */

export { useConfigurationFileReader } from "./useConfigurationFileReader.ts";
export { useConfigurationUrlReader } from "./useConfigurationUrlReader.ts";

// Re-export types for convenience
export type { UseConfigurationFileReader } from "./useConfigurationFileReader.ts";
export type { UseConfigurationUrlReader } from "./useConfigurationUrlReader.ts";
