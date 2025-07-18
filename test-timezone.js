#!/usr/bin/env node

/**
 * Test script for timezone functionality
 * Tests the dateHelper utilities
 */

const { 
  getCurrentTimestamp, 
  getCurrentSQLiteTimestamp, 
  convertToServerTimezone, 
  formatDisplayDate,
  getTimezoneInfo 
} = require('./dist/utils/dateHelper');

console.log('🕐 Testing Server Timezone (UTC+6) Functionality\n');

// Test timezone info
const timezoneInfo = getTimezoneInfo();
console.log('📍 Timezone Info:');
console.log(`   Name: ${timezoneInfo.name}`);
console.log(`   Offset: +${timezoneInfo.offset} hours`);
console.log(`   Description: ${timezoneInfo.description}\n`);

// Test current timestamps
console.log('⏰ Current Time Comparisons:');
console.log(`   System Time (UTC):    ${new Date().toISOString()}`);
console.log(`   Server Time (UTC+6):  ${getCurrentTimestamp()}`);
console.log(`   SQLite Format:        ${getCurrentSQLiteTimestamp()}\n`);

// Test timezone conversion
const utcTime = new Date().toISOString();
const serverTime = convertToServerTimezone(utcTime);
console.log('🔄 Timezone Conversion:');
console.log(`   UTC Time:    ${utcTime}`);
console.log(`   Server Time: ${serverTime}\n`);

// Test display formatting
const displayTime = formatDisplayDate(utcTime);
console.log('📅 Display Formatting:');
console.log(`   Formatted: ${displayTime}\n`);

// Test with specific times
console.log('🧪 Test with specific UTC times:');
const testTimes = [
  '2024-01-15T00:00:00.000Z', // Midnight UTC
  '2024-01-15T06:00:00.000Z', // 6 AM UTC (should be noon server time)
  '2024-01-15T12:00:00.000Z', // Noon UTC (should be 6 PM server time)
  '2024-01-15T18:00:00.000Z'  // 6 PM UTC (should be midnight server time)
];

testTimes.forEach(utcTime => {
  const serverTime = convertToServerTimezone(utcTime);
  const displayTime = formatDisplayDate(utcTime);
  console.log(`   ${utcTime} → ${serverTime} → ${displayTime}`);
});

console.log('\n✅ Timezone testing completed!');
console.log('\n💡 To test via API, start the server and visit:');
console.log('   http://localhost:3001/api/colleagues/timezone'); 