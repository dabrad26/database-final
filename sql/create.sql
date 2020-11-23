-- This creates the database with all tables and relationships.
-- Uncomment first line to reset table (for clean install).
-- By default this will error if alraedy exists

-- DROP DATABASE IF EXISTS db_final;

-- Create database
CREATE DATABASE db_final;
use db_final;

-- BEGIN: Create Tables

-- Create Organization Table
CREATE TABLE organization (
	organization_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  discount_percent DECIMAL(5,2) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  address_2 VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zip VARCHAR(12) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(16) NOT NULL
);

-- Create Customer Table
CREATE TABLE customer (
	customer_id INT AUTO_INCREMENT PRIMARY KEY,
	first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  address_2 VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zip VARCHAR(12) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(16),
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES organization (organization_id) ON UPDATE CASCADE
);

-- Create Employee Table
CREATE TABLE employee (
	employee_id INT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  address_2 VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zip VARCHAR(12) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(16) NOT NULL
);

-- Create Promotion Table
-- Changed to `promotion_term` as other promotions existed after checking company
CREATE TABLE promotion (
	promotion_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  promotion_term VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  new_customers_only BOOLEAN
);

-- Create Membership Type Table
CREATE TABLE membership_type (
	membership_type_id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  number_movie_tickets INT NOT NULL,
  number_guests INT NOT NULL,
  include_special_events BOOLEAN NOT NULL,
  employee_incentive DECIMAL(5,2) NOT NULL
);

-- Create Membership Table
CREATE TABLE membership (
	membership_id INT AUTO_INCREMENT PRIMARY KEY,
	membership_type_id INT NOT NULL,
	customer_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  second_adult_name VARCHAR(255),
  last_updated DATETIME,
  FOREIGN KEY (membership_type_id) REFERENCES membership_type (membership_type_id) ON UPDATE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customer (customer_id) ON UPDATE CASCADE
);

-- Create Movie Table
-- `is_3d` removed as type indicated this and different 3d systems need different glasses
CREATE TABLE movie (
	movie_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  type ENUM("IMAX", "3D IMAX", "35mm", "3D 35mm", "presentation") NOT NULL,
  adult_price DECIMAL(5,2) NOT NULL,
  child_price DECIMAL(5,2) NOT NULL
);

-- Create Benefit Table
CREATE TABLE benefit (
	benefit_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  discount DECIMAL(5,2) NOT NULL
);

-- Create Special Event Table
CREATE TABLE special_event (
	special_event_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date_time DATETIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  url VARCHAR(255)
);

-- Create Movie Ticket Table (this is using a movie ticket; a purchased ticket)
CREATE TABLE movie_ticket_purchase (
  movie_id INT NOT NULL,
  membership_id INT NOT NULL,
  date_time DATETIME NOT NULL,
  pass_used BOOLEAN NOT NULL,
  ticket_price DECIMAL(5,2),
  PRIMARY KEY (movie_id , membership_id),
  FOREIGN KEY (movie_id)  REFERENCES movie (movie_id) ON UPDATE CASCADE,
  FOREIGN KEY (membership_id)  REFERENCES membership (membership_id) ON UPDATE CASCADE
);

-- Create Benefit Used Table (this is using a benefit; more details tracked in POS)
CREATE TABLE benefit_used (
  benefit_id INT NOT NULL,
  membership_id INT NOT NULL,
  date_time DATETIME NOT NULL,
  price_paid DECIMAL(10,2),
  PRIMARY KEY (benefit_id , membership_id),
  FOREIGN KEY (benefit_id)  REFERENCES benefit (benefit_id) ON UPDATE CASCADE,
  FOREIGN KEY (membership_id)  REFERENCES membership (membership_id) ON UPDATE CASCADE
);

-- Create Event Attended Table (this is showing up to an event. `number_attendees` includes primary member)
CREATE TABLE event_attended (
  special_event_id INT NOT NULL,
  membership_id INT NOT NULL,
  number_attendees INT,
  PRIMARY KEY (special_event_id , membership_id),
  FOREIGN KEY (special_event_id)  REFERENCES special_event (special_event_id) ON UPDATE CASCADE,
  FOREIGN KEY (membership_id)  REFERENCES membership (membership_id) ON UPDATE CASCADE
);

-- Create Membership Purchase Table
CREATE TABLE membership_purchase (
	purchase_id INT AUTO_INCREMENT PRIMARY KEY,
	customer_id INT NOT NULL,
  employee_id INT NOT NULL,
  membership_id INT NOT NULL,
  membership_type_id INT NOT NULL,
  promotion_id INT,
  date_time DATETIME NOT NULL,
  total_paid DECIMAL(10,2) NOT NULL,
  payment_method ENUM("Cash", "Check", "Money Order", "American Express", "Discover", "Visa", "Mastercard", "Gift Card") NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customer (customer_id) ON UPDATE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employee (employee_id) ON UPDATE CASCADE,
  FOREIGN KEY (membership_id) REFERENCES membership (membership_id) ON UPDATE CASCADE,
  FOREIGN KEY (membership_type_id) REFERENCES membership_type (membership_type_id) ON UPDATE CASCADE,
  FOREIGN KEY (promotion_id) REFERENCES promotion (promotion_id) ON UPDATE CASCADE
);

-- Create View for membership list with calculatd fields
CREATE VIEW membership_list AS
  SELECT membership.*,
    (membership_type.number_movie_tickets - (SELECT COUNT(*) from movie_ticket_purchase
      INNER JOIN membership ON movie_ticket_purchase.membership_id = membership.membership_id
      WHERE movie_ticket_purchase.pass_used = TRUE AND (movie_ticket_purchase.date_time BETWEEN membership.start_date AND membership.end_date)
    )) AS movie_tickets_left,
    (DATEDIFF(membership.end_date, CURDATE()) > 0) AS is_expired
  FROM membership
  INNER JOIN movie_ticket_purchase ON movie_ticket_purchase.membership_id = membership.membership_id
  INNER JOIN membership_type ON membership_type.membership_type_id = membership.membership_type_id;

-- Create Trigger for Membership update
CREATE TRIGGER membership_last_updated BEFORE UPDATE
  ON membership FOR EACH ROW
  SET NEW.last_updated = NOW();

-- END: Create Tables

-- BEGIN: Create Static (ADMIN) Rows

-- Create Current Static Entries (these are admin tasks that change rarely)
-- Create Movies (Only 3-5 are ever available at one time)
INSERT INTO movie (`name`, `duration`, `start_date`, `type`, `adult_price`, `child_price`) VALUES ("Grand Canyon Adventure", 72, "2020-07-21", "3D IMAX", 6.50, 4.00);
INSERT INTO movie (`name`, `duration`, `start_date`, `end_date`, `type`, `adult_price`, `child_price`) VALUES ("Nemo's Sea Journey", 46, "2019-01-19", "2020-02-01", "IMAX", 5.50, 3.00);
INSERT INTO movie (`name`, `duration`, `start_date`, `type`, `adult_price`, `child_price`) VALUES ("Coral Reef", 48, "2020-09-14", "35mm", 4.50, 3.00);
INSERT INTO movie (`name`, `duration`, `start_date`, `type`, `adult_price`, `child_price`) VALUES ("Disney's Finding Nemo", 96, "2020-07-21", "IMAX", 9.50, 6.00);
INSERT INTO movie (`name`, `duration`, `start_date`, `type`, `adult_price`, `child_price`) VALUES ("Rocky Horror Picture Show [ADULT ONLY]", 110, "2020-10-31", "35mm", 5.00, 5.00);

-- Create Benefits (roughly based on real benefits available)
INSERT INTO benefit (`name`, `discount`) VALUES ("Gift Shop Discount", 10.00);
INSERT INTO benefit (`name`, `discount`) VALUES ("Concessions Discount", 15.00);
INSERT INTO benefit (`name`, `discount`) VALUES ("Facility Rental Discount", 20.00);
INSERT INTO benefit (`name`, `discount`) VALUES ("Birthday Party Discount", 20.00);
INSERT INTO benefit (`name`, `discount`) VALUES ("Sleep With the Fishes Discount", 30.00);
INSERT INTO benefit (`name`, `discount`) VALUES ("Movie Theater [Full Price] Discount", 15.00);
INSERT INTO benefit (`name`, `discount`) VALUES ("Canoe The Flint Discount", 25.00);
INSERT INTO benefit (`name`, `discount`) VALUES ("Summer Camp Discount", 10.00);
INSERT INTO benefit (`name`, `discount`) VALUES ("Holiday Camp Discount", 15.00);

-- Create Special Events (these are usually added about 2 months prior to actual event. Most members invited. But any who show up are allowed entry)
INSERT INTO special_event (`name`, `date_time`, `location`, `url`) VALUES ("Tadpole Time: Fireflies", "2020-08-05 09:30:00", "Education Room", "http://flintriverquarium.com/participate/tadpole-time");
INSERT INTO special_event (`name`, `date_time`, `location`) VALUES ("Return to School Bash", "2020-08-20 20:00:00", "Grand Hall");
INSERT INTO special_event (`name`, `date_time`, `location`, `url`) VALUES ("Tadpole Time: Snakes", "2020-09-02 09:30:00", "Education Room", "http://flintriverquarium.com/participate/tadpole-time");
INSERT INTO special_event (`name`, `date_time`, `location`) VALUES ("Halloween Movie Night", "2020-10-31 18:00:00", "Theater");
INSERT INTO special_event (`name`, `date_time`, `location`, `url`) VALUES ("Tadpole Time: Nocturnal Animals", "2020-10-07 09:30:00", "Education Room", "http://flintriverquarium.com/participate/tadpole-time");
INSERT INTO special_event (`name`, `date_time`, `location`) VALUES ("A Turtle Thanksgiving Party", "2020-11-26 13:30:00", "Lobby");
INSERT INTO special_event (`name`, `date_time`, `location`, `url`) VALUES ("Tadpole Time: Trees", "2020-11-13 09:30:00", "Education Room", "http://flintriverquarium.com/participate/tadpole-time");
INSERT INTO special_event (`name`, `date_time`, `location`) VALUES ("Local Merchant Expo", "2020-12-01 11:30:00", "Courtyard");
INSERT INTO special_event (`name`, `date_time`, `location`, `url`) VALUES ("Tadpole Time: The Beach", "2020-12-11 09:30:00", "Education Room", "http://flintriverquarium.com/participate/tadpole-time");
INSERT INTO special_event (`name`, `date_time`, `location`) VALUES ("Christmas Tree Lighting", "2020-12-05 17:00:00", "Lobby");
INSERT INTO special_event (`name`, `date_time`, `location`) VALUES ("Dinner with Santa", "2020-12-15 18:30:00", "Grand Hall");
INSERT INTO special_event (`name`, `date_time`, `location`) VALUES ("Santa Dive Show", "2020-12-18 11:45:00", "Blue Hole");
INSERT INTO special_event (`name`, `date_time`, `location`) VALUES ("Santa Dive Show", "2020-12-19 14:30:00", "Blue Hole");
INSERT INTO special_event (`name`, `date_time`, `location`) VALUES ("Christmas Gala", "2020-12-21 18:30:00", "Grand Hall");
INSERT INTO special_event (`name`, `date_time`, `location`) VALUES ("New Year Ball Drop Watching Party", "2020-12-31 21:30:00", "Grand Hall");

-- Create Membership Types (based on older setup prior to change at company)
INSERT INTO membership_type VALUES (1, "Individual", 49.00, 0, 1, TRUE, 2.00);
INSERT INTO membership_type VALUES (2, "Family", 89.00, 4, 6, TRUE, 3.00);
INSERT INTO membership_type VALUES (5, "Friend", 199.00, 6, 6, TRUE, 5.00);
INSERT INTO membership_type VALUES (6, "Contributor", 349.00, 10, 8, TRUE, 7.00);
INSERT INTO membership_type VALUES (7, "Blue Hole Society", 1000.00, 10, 8, TRUE, 10.00);

-- Create Promotions
INSERT INTO promotion (`name`, `promotion_term`, `start_date`, `new_customers_only`) VALUES ("Early Renewal", "Extra 31 days", "2018-01-01", FALSE);
INSERT INTO promotion (`name`, `promotion_term`, `start_date`, `end_date`, `new_customers_only`) VALUES ("Christmas Membership Drive", "30% Off New Memberships", "2020-11-26", "2021-01-01", TRUE);
INSERT INTO promotion (`name`, `promotion_term`, `start_date`, `new_customers_only`) VALUES ("ASU Referral", "10% Off When Mentioning Golden Rams", "2017-10-01", FALSE);
INSERT INTO promotion (`name`, `promotion_term`, `start_date`, `new_customers_only`) VALUES ("Refer a Friend", "10% Off When Referred by a friend", "2015-01-01", TRUE);

-- Create Corporate Sponsors (Organizations)
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Sumter Regional", 25.00, "John Smith", "510 Main Street", "Albany", "GA", "31701", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Phoebe Hospital", 18.00, "Jane Doe", "314 Armena Road", "Worth", "GA", "31708", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Albany State", 35.00, "Clancy Camp", "659 Old Highway Road", "Leesburg", "GA", "31705-9526", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `address_2`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("New Haven Animal Shelter", 10.00, "Rex Charles", "10 Broadway Ave", "Suite 4A", "Albany", "GA", "31709", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Avalon Access", 12.00, "Sheila Cartman", "456 Avenue of the Americas", "Atlanta", "GA", "31685", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Darton College", 18.00, "Elaine Cramer", "6852 Main Street", "Albany", "GA", "31701", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Sumter Dental Association", 26.00, "Gerald Lovejoy", "800 Sumter Ave", "Americus", "GA", "31852", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Gamestop", 52.00, "Kratos Sim", "12 43rd Street", "Atlanta", "GA", "35262", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Public Grocery", 12.00, "Kyle Marsh", "2365 MLK Ave", "Albany", "GA", "31403", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Cheehaw Park", 20.00, "Charles Garrison", "12 Block Ave", "Leesburg", "GA", "31763", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Soft Chews Group", 18.00, "Xu Ping", "5856 Murphy Road", "Dawson", "GA", "31625", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Viewport Isles", 12.00, "Jeff Yu", "5627 Rural Route 85", "Pensacola", "FL", "62523", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Target of the Southeast", 26.00, "Janis White", "985 W 34th Street", "Atlanta", "GA", "36526", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Joan Good Store", 5.50, "Joan Winters", "253 Worth Street", "Americus", "GA", "31709", "john@email.com", "212-555-1010");
INSERT INTO organization (`name`, `discount_percent`, `contact_name`, `address`, `city`, `state`, `zip`, `email`, `phone`) VALUES ("Home Goods Bath House", 7.00, "Charles Hine", "652 Jack Street", "Atlanta", "GA", "36856", "john@email.com", "212-555-1010");

-- Create Employees (about 10 employees were ever in sales)
INSERT INTO employee VALUES (65, "Ticket Office Sales Associate", "John", "Snow", "652 Jack Street", NULL, "Atlanta", "GA", "36856", "john@email.com", "212-555-1010");
INSERT INTO employee VALUES (78, "Ticket Office Supervisor", "Meredyth", "Kreeger", "510 Main Street", NULL, "Albany", "GA", "31701", "john@email.com", "212-555-1010");
INSERT INTO employee VALUES (512, "Ticket Office Sales Associate", "Keesha", "Jackson", "314 Armena Road", NULL, "Worth", "GA", "31708", "john@email.com", "212-555-1010");
INSERT INTO employee VALUES (211, "Ticket Office Sales Associate", "Gerard", "Pinto", "659 Old Highway Road", NULL, "Leesburg", "GA", "31705-9526", "john@email.com", "212-555-1010");
INSERT INTO employee VALUES (420, "Gift Shop Manager", "Steve", "Briskal", "10 Broadway Ave", "Suite 4A", "Albany", "GA", "31709", "john@email.com", "212-555-1010");
INSERT INTO employee VALUES (622, "Concessions Supervisor", "Huck", "Brisk", "456 Avenue of the Americas", NULL, "Atlanta", "GA", "31685", "john@email.com", "212-555-1010");
INSERT INTO employee VALUES (952, "Rotating Sales Associate", "Cynthia", "Kim", "6852 Main Street", NULL, "Albany", "GA", "31701", "john@email.com", "212-555-1010");
INSERT INTO employee VALUES (1520, "IMAX Sales Associate/Projectionist", "Howard", "Yu", "800 Sumter Ave", NULL, "Americus", "GA", "31852", "john@email.com", "212-555-1010");
INSERT INTO employee VALUES (250, "Ticket Office Sales Associate", "Kim", "Roberts", "12 43rd Street", NULL, "Atlanta", "GA", "35262", "john@email.com", "212-555-1010");
INSERT INTO employee VALUES (625, "Telephone Sales Associate", "Lucia", "Jackson", "2365 MLK Ave", NULL, "Albany", "GA", "31403", "john@email.com", "212-555-1010");
INSERT INTO employee VALUES (985, "Weekend Box Office Manager", "karen", "LeBlowski", "12 Block Ave", NULL, "Leesburg", "GA", "31763", "john@email.com", "212-555-1010");

-- END: Create Static (ADMIN) Rows
