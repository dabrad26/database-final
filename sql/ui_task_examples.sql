-- This file contains example queries and tasks that are handled by the UI (SQL templates found in server/api.js)
-- These are examples that create rows for the Customer, Membership Purchase, Membership, Movie Ticket Purchases, Benefits Used and Events Attended Tables.
-- This file is just for examples and should not be ran unless needed for seeding the database

-- Get list of all organizations for drop down on customer create
SELECT organization_id AS "id", name, discount_percent FROM organization ORDER BY name;

-- Create Membership Transaction
START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (5, 1, "2020-11-23", "2021-11-23", "Jack Ripper");
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (2, 512, LAST_INSERT_ID(), 5, NULL, NOW(), "120.33", "Cash");
COMMIT;
