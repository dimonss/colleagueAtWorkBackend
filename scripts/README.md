# Data Management Scripts

This directory contains scripts for managing data in the database.

## Available Scripts

### 🌱 addMockDataIntoDB.ts - Populate with Mock Data

Adds 10 test employees to the database with diverse positions and departments.

**Usage:**
```bash
# Normal addition (with existing data check)
npm run seed

# Force addition (even if data already exists)
npm run seed:force
```

**Data to be added:**
- 10 employees with different positions
- Various departments: Engineering, Design, Product, QA, Infrastructure, Marketing, Analytics, HR
- Realistic data: names, emails, phones, salaries, hire dates
- Useful notes about each employee

### 🗑️ clearDB.ts - Database Cleanup

Removes all employee records from the database.

**Usage:**
```bash
# Normal cleanup (with confirmation)
npm run clear

# Force cleanup (without confirmation)
npm run clear:force
```

**What it does:**
- Removes all records from the `colleagues` table
- Resets the ID auto-increment
- Shows statistics of deleted records

## Usage Examples

### Complete Data Reload
```bash
# Clear the database
npm run clear:force

# Add fresh mock data
npm run seed
```

### Adding Data to Existing Records
```bash
# Add mock data to existing records
npm run seed:force
```

### Check Current Status
```bash
# Start the server
npm run dev

# Check the API
curl http://localhost:3001/api/colleagues
```

## Mock Data Structure

Each employee contains:
- **Name**: Realistic Russian names
- **Position**: Various IT and business roles
- **Department**: 8 different departments
- **Email**: Corporate email addresses
- **Phone**: Russian phone numbers
- **Hire Date**: Various dates over the last 3 years
- **Salary**: Realistic salaries (75k - 140k)
- **Notes**: Descriptive notes about skills and achievements

## Security

- Scripts request confirmation before deleting data
- Use the `--force` flag for automatic execution
- Scripts work only with the `colleagues` table (don't affect users)
- All operations are logged to console

## Integration with Tests

Scripts can be used to prepare test data:

```bash
# Prepare data for testing
npm run clear:force
npm run seed

# Run tests
npm test
``` 