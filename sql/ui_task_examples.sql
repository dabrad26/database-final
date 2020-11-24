-- This file contains example queries and tasks that are handled by the UI (SQL templates found in server/api.js)
-- These are examples that create rows for the Customer, Membership Purchase, Membership, Movie Ticket Purchases, Benefits Used and Events Attended Tables.
-- This file is just for examples and should not be ran unless needed for seeding the database

-- Get List of organizations
SELECT organization_id, name, discount_percent FROM organization ORDER BY name;

-- Get List of customers with their org (if applicable)
SELECT customer.*, organization.name AS "org_name", organization.discount_percent AS "org_discount_percent" FROM customer
  LEFT JOIN organization ON customer.organization_id = organization.organization_id ORDER BY customer.last_name;

-- Create fake customers
INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Karola", "Halfhide", "11 Schlimgen Lane", NULL, "Albany", "GA", "93441", "khalfhidet@java.com", "404-587-1845", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Lacee", "Davidesco", "600 Ronald Regan Hill", NULL, "Albany", "MA", "78035", "ldavidescos@globo.com", "978-503-2397", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Mariejeanne", "O'Kinneally", "57 Blue Bill Park Place", NULL, "Albany", "VA", "67957", "mokinneallyr@alibaba.com", "757-623-1506", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Lorens", "Hewlings", "63810 Kensington Center", NULL, "Albany", "NC", "77703", "lhewlingsq@tamu.edu", "919-335-5667", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Rozelle", "Coverdill", "03761 Hintze Junction", NULL, "Albany", "NY", "55847", "rcoverdillp@marriott.com", "716-302-6282", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Mahalia", "Peiro", "272 Mccormick Center", NULL, "Albany", "GA", "56087", "mpeiroo@telegraph.co.uk", "678-755-9757", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Lissi", "Golsworthy", "4140 Hooker Parkway", NULL, "Albany", "DC", "56622", "lgolsworthyn@adobe.com", "202-577-5693", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Alonzo", "Lamdin", "8 Chive Road", NULL, "Albany", "DC", "27962", "alamdinm@chronoengine.com", "202-907-5992", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Morena", "Perett", "74827 Randy Trail", NULL, "Albany", "VA", "68921", "mperettl@ehow.com", "571-306-5039", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Corrine", "Goudie", "7 Sage Center", NULL, "Albany", "AZ", "50794", "cgoudiek@dailymotion.com", "623-605-6099", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Rahel", "Fink", "536 Maple Place", NULL, "Albany", "OH", "80906", "rfinkj@themeforest.net", "614-980-2527", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Lothaire", "Sterman", "361 American Pass", NULL, "Albany", "TX", "74849", "lstermani@csmonitor.com", "214-691-2187", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Siana", "Jorg", "06 Muir Terrace", NULL, "Albany", "WA", "57739", "sjorgh@gizmodo.com", "360-396-8454", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Philbert", "Tonge", "180 Graceland Plaza", NULL, "Albany", "KY", "48543", "ptongeg@prnewswire.com", "502-966-9624", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Teriann", "Plumstead", "12 Emmet Avenue", NULL, "Albany", "MD", "50057", "tplumsteadf@newyorker.com", "301-762-1135", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Maryanna", "Tollerton", "7 Michigan Junction", NULL, "Albany", "NY", "41201", "mtollertone@mediafire.com", "315-669-0411", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Angelia", "Francklyn", "072 Eggendart Circle", NULL, "Albany", "MT", "80531", "afrancklynd@utexas.edu", "406-858-8957", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Lyndel", "Bishop", "2 Village Green Terrace", NULL, "Albany", "LA", "92691", "lbishopc@pcworld.com", "225-448-4956", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Bonny", "De Angelo", "97 Thackeray Place", NULL, "Albany", "PA", "75294", "bdeangelob@digg.com", "412-416-2378", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Lindsy", "Burston", "5 Eggendart Avenue", NULL, "Albany", "CO", "44696", "lburstona@nps.gov", "303-760-6203", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Sapphire", "Sobtka", "28169 Longview Street", NULL, "Albany", "CA", "38681", "ssobtka9@samsung.com", "323-720-5801", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Winna", "Faulder", "67 Carey Street", NULL, "Albany", "KY", "75559", "wfaulder8@bing.com", "502-899-7176", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Raquel", "Konertz", "8498 Dennis Alley", NULL, "Albany", "NM", "54391", "rkonertz7@miitbeian.gov.cn", "505-408-7480", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Kennie", "Fawbert", "1655 Valley Edge Lane", NULL, "Albany", "NE", "59302", "kfawbert6@themeforest.net", "402-990-8211", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Haslett", "Mingey", "40 Chinook Center", NULL, "Albany", "OH", "77384", "hmingey5@nhs.uk", "513-883-6067", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Ragnar", "O' Faherty", "3 Caliangt Pass", NULL, "Albany", "KY", "40020", "rofaherty4@gnu.org", "859-864-5999", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Guy", "Varty", "3269 Victoria Crossing", NULL, "Albany", "TX", "47208", "gvarty3@mit.edu", "832-119-1141", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Delmer", "Wilshin", "08 8th Park", NULL, "Albany", "AZ", "43306", "dwilshin2@flickr.com", "602-189-8971", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Francklyn", "Vickarman", "49 Lake View Crossing", NULL, "Albany", "AZ", "98085", "fvickarman1@businesswire.com", "602-545-9631", NULL);

INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
  VALUES ("Logan", "Pittson", "01 Thierer Circle", NULL, "Albany", "GA", "36823", "lpittson0@ning.com", "404-446-5050", NULL);

-- Update a customer
UPDATE customer SET
  first_name = "Lacee", last_name = "Davidesco", address = "600 Ronald Regan Hill", address_2 = NULL, city = "Albany", state = "MA", zip = "78035", email = "ldavidescos@globo.com", phone = "978-503-2397", organization_id = "6"
  WHERE customer_id = 30;

UPDATE customer SET
  first_name = "Kennie", last_name = "Fawbert", address = "1655 Valley Edge Lane", address_2 = "Apt 16D", city = "Albany", state = "NE", zip = "59302", email = "kfawbert6@themeforest.net", phone = "402-990-8211", organization_id = NULL
  WHERE customer_id = 8;

UPDATE customer SET
  first_name = "Lyndel", last_name = "Bishop", address = "2 Village Green Terrace", address_2 = NULL, city = "Albany", state = "LA", zip = "92691", email = "lbishopc@pcworld.com", phone = "225-448-4956", organization_id = "9"
  WHERE customer_id = 14;

-- Sell a customer a membership (in UI transaction is handled by transaction function in sql Class)
START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (2, 14 , "2020-11-24", "2021-11-24", "Tony Soprano");
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (14, 512, LAST_INSERT_ID(), 2, 4, NOW(), "$80.99", "Cash");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (5, 12 , "2020-11-24", "2021-11-24", "John smith");
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (12, 1520, LAST_INSERT_ID(), 5, 3, NOW(), "129.99", "Cash");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (5, 27 , "2020-11-24", "2020-11-22", "Jake Dillon");
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (27, 1520, LAST_INSERT_ID(), 5, NULL, NOW(), "$129.99", "Discover");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (7, 30 , "2020-11-24", "2021-11-24", "Clancy Yu");
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (30, 1520, LAST_INSERT_ID(), 7, 4, NOW(), "$988", "Money Order");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (2, 10 , "2020-11-24", "2021-11-24", NULL);
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (10, 420, LAST_INSERT_ID(), 2, NULL, NOW(), "89", "Cash");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (6, 15 , "2020-11-24", "2021-11-24", "Howard Jin");
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (15, 512, LAST_INSERT_ID(), 6, NULL, NOW(), "349", "Gift Card");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (2, 25 , "2020-11-24", "2021-11-24", NULL);
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (25, 512, LAST_INSERT_ID(), 2, NULL, NOW(), "89", "Cash");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (7, 6 , "2020-11-24", "2019-11-24", NULL);
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (6, 622, LAST_INSERT_ID(), 7, 3, NOW(), "990", "American Express");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (2, 17 , "2020-11-24", "2021-11-24", "Jack Lop");
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (17, 512, LAST_INSERT_ID(), 2, NULL, NOW(), "89", "Cash");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (5, 9 , "2020-11-24", "2021-11-24", NULL);
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (9, 622, LAST_INSERT_ID(), 5, 4, NOW(), "187", "Check");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (2, 23 , "2020-11-24", "2021-11-24", "Jack Donague");
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (23, 622, LAST_INSERT_ID(), 2, NULL, NOW(), "89", "Cash");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (5, 26 , "2020-11-24", "2018-11-24", "John Doe");
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (26, 1520, LAST_INSERT_ID(), 5, NULL, NOW(), "199", "Gift Card");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (7, 4 , "2020-11-24", "2021-11-24", NULL);
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (4, 622, LAST_INSERT_ID(), 7, NULL, NOW(), "1000", "Cash");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (2, 24 , "2020-11-24", "2021-11-24", NULL);
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (24, 622, LAST_INSERT_ID(), 2, NULL, NOW(), "89", "Cash");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (5, 29 , "2020-11-24", "2021-11-24", "Mike Hollis");
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (29, 1520, LAST_INSERT_ID(), 5, NULL, NOW(), "199", "Cash");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (7, 11 , "2020-11-24", "2021-11-24", "John Smith");
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (11, 1520, LAST_INSERT_ID(), 7, 3, NOW(), "900", "Check");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (5, 3 , "2020-11-24", "2021-11-24", "John Smith");
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (3, 622, LAST_INSERT_ID(), 5, NULL, NOW(), "199", "Cash");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (2, 18 , "2020-11-24", "2021-11-24", NULL);
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (18, 622, LAST_INSERT_ID(), 2, 3, NOW(), "78", "Cash");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (6, 16 , "2020-11-24", "2019-11-24", NULL);
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (16, 622, LAST_INSERT_ID(), 6, NULL, NOW(), "349", "Cash");
COMMIT;

START TRANSACTION;
  INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
    VALUES (2, 20 , "2020-11-24", "2020-11-24", NULL);
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (20, 622, LAST_INSERT_ID(), 2, 4, NOW(), "78", "Discover");
COMMIT;

-- Renew a membership
START TRANSACTION;
  UPDATE membership SET membership_type_id = 2, customer_id = 25, start_date = "2020-11-24", end_date = "2022-12-24", second_adult_name = NULL
    WHERE membership_id = 7;
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (25, 622, 7, 2, 1, NOW(), "89", "Cash");
COMMIT;

START TRANSACTION;
  UPDATE membership SET membership_type_id = 5, customer_id = 10, start_date = "2020-11-24", end_date = "2022-11-24", second_adult_name = NULL
    WHERE membership_id = 5;
  INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
    VALUES (10, 622, 5, 5, NULL, NOW(), "199", "Cash");
COMMIT;

-- View all customers
SELECT customer.*, organization.name AS "org_name", organization.discount_percent AS "org_discount_percent" FROM customer
  LEFT JOIN organization ON customer.organization_id = organization.organization_id
  ORDER BY customer.last_name;

-- View all members
SELECT * FROM membership_list
  ORDER BY last_name;

-- View all members that are not expired
SELECT * FROM membership_list
  HAVING `is_expired` = 0
  ORDER BY last_name;

-- View all members that are expired
SELECT * FROM membership_list
  HAVING `is_expired` = 1
  ORDER BY last_name;

-- View all members that expired in last 31 days
SELECT * FROM membership_list
  WHERE DATEDIFF(CURDATE(), end_date) < 31
  HAVING `is_expired` = 1
  ORDER BY last_name;

-- Search for a customer (this searches for user with email `lburstona@nps.gov`)
SELECT customer.*, organization.name AS "org_name", organization.discount_percent AS "org_discount_percent" FROM customer
  LEFT JOIN organization ON customer.organization_id = organization.organization_id
  WHERE (LOWER(customer.last_name) LIKE LOWER('%lburstona@nps.gov%')) OR
  (LOWER(customer.first_name) LIKE LOWER('%lburstona@nps.gov%')) OR
  (LOWER(customer.email) LIKE LOWER('%lburstona@nps.gov%')) OR
  (LOWER(customer.phone) LIKE LOWER('%lburstona@nps.gov%')) OR
  (LOWER(customer.address) LIKE LOWER('%lburstona@nps.gov%'))
  ORDER BY customer.last_name;

-- Search for a member (this searches for user with name `Tollerton`)
SELECT * FROM membership_list
  WHERE (LOWER(last_name) LIKE LOWER('%Tollerton%')) OR
  (LOWER(first_name) LIKE LOWER('%Tollerton%')) OR
  (LOWER(email) LIKE LOWER('%Tollerton%')) OR
  (LOWER(phone) LIKE LOWER('%Tollerton%')) OR
  (LOWER(address) LIKE LOWER('%Tollerton%'))
  ORDER BY last_name;

-- Search for an active member (exclude expired) (this searches for user with name `Tollerton`)
SELECT * FROM membership_list
  WHERE (LOWER(last_name) LIKE LOWER('%Tollerton%')) OR
  (LOWER(first_name) LIKE LOWER('%Tollerton%')) OR
  (LOWER(email) LIKE LOWER('%Tollerton%')) OR
  (LOWER(phone) LIKE LOWER('%Tollerton%')) OR
  (LOWER(address) LIKE LOWER('%Tollerton%'))
  HAVING `is_expired` = 0
  ORDER BY last_name;

-- View Employee Incentives earned during a date range
SELECT employee.*, SUM(membership_type.employee_incentive) AS "total_earned", COUNT(*) AS "total_sold"
  FROM membership_purchase
  LEFT JOIN employee ON employee.employee_id = membership_purchase.employee_id
  LEFT JOIN membership_type ON membership_purchase.membership_type_id = membership_type.membership_type_id
  WHERE CAST(membership_purchase.date_time AS DATE) BETWEEN "2020-10-24" AND "2020-11-24"
  GROUP BY employee.employee_id
  ORDER BY "total_earned";

-- Get Specific member with customer information (in this case member 14)
SELECT * FROM membership_list
  WHERE membership_id = 14;

-- Get movie tickets purchased for a specific user (in this case member 14)
SELECT movie_ticket_purchase.*, movie.name FROM movie_ticket_purchase
  LEFT JOIN movie ON movie_ticket_purchase.movie_id = movie.movie_id
  WHERE movie_ticket_purchase.membership_id = 14
  ORDER BY movie_ticket_purchase.date_time DESC;

-- Get all movies that are currently playing (not including old movies)
SELECT * FROM movie WHERE end_date IS NULL OR end_date > CURDATE() ORDER BY name;

-- Use a pass toward a movie
INSERT INTO movie_ticket_purchase (movie_id, membership_id, date_time, pass_used, ticket_price)
  VALUES (3, 14, NOW(), true, 4.5);

-- Buy a movie ticket without a pass
INSERT INTO movie_ticket_purchase (movie_id, membership_id, date_time, pass_used, ticket_price)
  VALUES (4, 14, NOW(), false, 9.5);

-- Get all benefits used for a specific user (in this case member 14)
SELECT benefit_used.*, benefit.name, benefit.discount FROM benefit_used
  LEFT JOIN benefit ON benefit_used.benefit_id = benefit.benefit_id
  WHERE benefit_used.membership_id = 14
  ORDER BY benefit_used.date_time DESC;

-- Get all benefits available
SELECT * FROM benefit ORDER BY name;

-- Use a benefit (record usage)
INSERT INTO benefit_used (benefit_id, membership_id, date_time, price_paid)
  VALUES (7, 14, NOW(), 45.98);

-- Get all special events events attended for a specific user (in this case member 14)
SELECT event_attended.*, special_event.name, special_event.location FROM event_attended
  LEFT JOIN special_event ON event_attended.special_event_id = special_event.special_event_id
  WHERE event_attended.membership_id = 14
  ORDER BY special_event.date_time DESC;

-- Get all special events that are today or in the future
SELECT * FROM special_event
  WHERE CAST(date_time AS DATE) >= CURDATE()
  ORDER BY date_time ASC;

-- Attend an event
INSERT INTO event_attended (special_event_id, membership_id, number_attendees)
  VALUES (6, 14, 3);

