-- This file contains example queries and tasks that are handled by the UI (SQL templates found in server/api.js)
-- These are examples that create rows for the Customer, Membership Purchase, Membership, Movie Ticket Purchases, Benefits Used and Events Attended Tables.
-- This file is just for examples and should not be ran unless needed for seeding the database

-- Get list of all organizations for drop down on customer create
SELECT organization_id AS "id", name, discount_percent FROM organization ORDER BY name;
