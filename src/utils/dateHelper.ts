/**
 * Date utilities with timezone support
 * Server timezone: +6 hours (UTC+6)
 */

const SERVER_TIMEZONE_OFFSET = 6; // UTC+6 hours

/**
 * Get current timestamp in server timezone (UTC+6)
 * @returns ISO string with server timezone
 */
export const getCurrentTimestamp = (): string => {
  const now = new Date();
  const serverTime = new Date(now.getTime() + (SERVER_TIMEZONE_OFFSET * 60 * 60 * 1000));
  return serverTime.toISOString().replace('Z', '+06:00');
};

/**
 * Get current timestamp for SQLite (without timezone info)
 * @returns ISO string compatible with SQLite DATETIME
 */
export const getCurrentSQLiteTimestamp = (): string => {
  const now = new Date();
  const serverTime = new Date(now.getTime() + (SERVER_TIMEZONE_OFFSET * 60 * 60 * 1000));
  return serverTime.toISOString().replace('T', ' ').replace('Z', '').slice(0, 19);
};

/**
 * Convert UTC timestamp to server timezone
 * @param utcTimestamp UTC timestamp
 * @returns ISO string with server timezone
 */
export const convertToServerTimezone = (utcTimestamp: string): string => {
  const utcDate = new Date(utcTimestamp);
  const serverTime = new Date(utcDate.getTime() + (SERVER_TIMEZONE_OFFSET * 60 * 60 * 1000));
  return serverTime.toISOString().replace('Z', '+06:00');
};

/**
 * Format date for display in server timezone
 * @param timestamp ISO timestamp
 * @returns Formatted date string
 */
export const formatDisplayDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const serverTime = new Date(date.getTime() + (SERVER_TIMEZONE_OFFSET * 60 * 60 * 1000));
  
  return serverTime.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

/**
 * Get timezone info
 * @returns Timezone information
 */
export const getTimezoneInfo = () => {
  return {
    offset: SERVER_TIMEZONE_OFFSET,
    name: 'UTC+6',
    description: 'Server timezone (UTC+6)'
  };
}; 