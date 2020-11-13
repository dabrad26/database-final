-- This file creates the user for the application to talk to the database.
-- This is optional and is only needed if using the test user referenced by the Express Server.
-- NOTE: Due to v8 of MySQL this requires native password identification to work with NodeJS.
CREATE USER 'school_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'school_pass';
GRANT DELETE, INSERT, SELECT, UPDATE ON db_final.* TO 'school_user'@'localhost';
