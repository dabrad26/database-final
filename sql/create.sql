-- This creates the database with all tables and relationships.
-- Uncomment first line to reset table (for clean install).
-- By default this will error if alraedy exists

-- DROP DATABASE IF EXISTS db_final;

-- Create database
CREATE DATABASE db_final;
use db_final;

-- Create Tables
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
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  second_adult_name VARCHAR(255),
  FOREIGN KEY (membership_type_id) REFERENCES membership_type (membership_type_id) ON UPDATE CASCADE
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
  total_Paid DECIMAL(10,2) NOT NULL,
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

-- END CREATE TABLE

-- Create Current Static Entries (Movies, Benefits, Membership Types; these are admin events that change rarely)
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

-- Create Membership Types (based on older setup prior to change at company)
INSERT INTO membership_type VALUES (1, "Individual", 49.00, 0, 1, TRUE, 2.00);
INSERT INTO membership_type VALUES (2, "Family", 89.00, 4, 6, TRUE, 3.00);
INSERT INTO membership_type VALUES (5, "Friend", 199.00, 6, 6, TRUE, 5.00);
INSERT INTO membership_type VALUES (6, "Contributor", 349.00, 10, 8, TRUE, 7.00);
INSERT INTO membership_type VALUES (7, "Blue Hole Society", 1000.00, 10, 8, TRUE, 10.00);
