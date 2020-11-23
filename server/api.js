const express = require('express');
const sql = require('./sql');

const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
});

/**
 * API Route: `/api/organizations`
 *
 * Return list of organizations
 */
router.get('/organizations', (req, res) => {
  const query = 'SELECT organization_id, name, discount_percent FROM organization ORDER BY name;';

  sql.query(query).then(data => {
    res.send({
      query,
      data
    })
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/organizations`
 *
 * Return list of organizations
 */
router.get('/promotions', (req, res) => {
  const query = 'SELECT * FROM promotion WHERE (CURDATE() BETWEEN start_date AND end_date) OR end_date IS NULL ORDER BY name;';

  sql.query(query).then(data => {
    res.send({
      query,
      data
    })
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/membership_types`
 *
 * Return list of membership types
 */
router.get('/membership_types', (req, res) => {
  const query = 'SELECT * FROM membership_type ORDER BY price;';

  sql.query(query).then(data => {
    res.send({
      query,
      data
    })
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/employees`
 *
 * Return list of employees
 */
router.get('/employees', (req, res) => {
  const query = 'SELECT * FROM employee ORDER BY last_name;';

  sql.query(query).then(data => {
    res.send({
      query,
      data
    })
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/customers`
 *
 * Return list of customers
 */
router.get('/customers', (req, res) => {
  const search = req.query.q;
  let query = `SELECT customer.*, organization.name AS "org_name", organization.discount_percent AS "org_discount_percent" FROM customer
    LEFT JOIN organization ON customer.organization_id = organization.organization_id `;

  if (search) {
    query = query + `WHERE (LOWER(customer.last_name) LIKE LOWER('%${search}%')) OR (LOWER(customer.first_name) LIKE LOWER('%${search}%')) OR (LOWER(customer.email) LIKE LOWER('%${search}%')) OR (LOWER(customer.phone) LIKE LOWER('%${search}%')) OR (LOWER(customer.address) LIKE LOWER('%${search}%')) `;
  }

  query = query + 'ORDER BY customer.last_name;';

  sql.query(query).then(data => {
    res.send({
      query,
      data
    })
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/customers/:id`
 *
 * Return specific customer
 */
router.get('/customers/:id', (req, res) => {
  const query = `SELECT * FROM customer WHERE customer_id = ${req.params.id};`;

  sql.query(query).then(data => {
    if (data.length) {
      res.send({
        query,
        data: data[0]
      });
    } else {
      res.status(404);
      res.send(`Customer with ID ${req.params.id} not found`);
    }
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/customers/:id`
 *
 * Delete specific customer
 */
router.delete('/customers/:id', (req, res) => {
  const query = `DELETE FROM customer WHERE customer_id = ${req.params.id};`;

  sql.query(query).then(data => {
    res.send({
      query,
      data
    })
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/customers`
 *
 * Create customer
 */
router.post('/customers', (req, res) => {
  const query = `INSERT INTO customer (first_name, last_name, address, address_2, city, state, zip, email, phone, organization_id)
    VALUES ("${req.body.first_name}", "${req.body.last_name}", "${req.body.address}", ${req.body.address_2 ? `"${req.body.address_2}"` : "NULL"}, "${req.body.city}", "${req.body.state}", "${req.body.zip}", ${req.body.email ? `"${req.body.email}"` : "NULL"}, ${req.body.phone ? `"${req.body.phone}"` : "NULL"}, ${req.body.organization_id ? `"${req.body.organization_id}"` : "NULL"});
  `;

  sql.query(query).then(data => {
    res.send({
      query,
      data
    })
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/customers`
 *
 * Update customer
 */
router.put('/customers', (req, res) => {
  const query = `UPDATE customer SET
    first_name = "${req.body.first_name}", last_name = "${req.body.last_name}", address = "${req.body.address}", address_2 = ${req.body.address_2 ? `"${req.body.address_2}"` : "NULL"}, city = "${req.body.city}", state = "${req.body.state}", zip = "${req.body.zip}", email = ${req.body.email ? `"${req.body.email}"` : "NULL"}, phone = ${req.body.phone ? `"${req.body.phone}"` : "NULL"}, organization_id = ${req.body.organization_id ? `"${req.body.organization_id}"` : "NULL"}
    WHERE customer_id = ${req.body.customer_id};
  `;

  sql.query(query).then(data => {
    res.send({
      query,
      data
    })
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/customers/:id/membership`
 *
 * Return specific customer's membership or just customer if no membership exists
 */
router.get('/customers/:id/membership', (req, res) => {
  const query = `SELECT customer.*, organization.name AS "org_name", organization.discount_percent AS "org_discount_percent", membership.* FROM membership
    INNER JOIN customer ON membership.customer_id = customer.customer_id
    LEFT JOIN organization ON organization.organization_id = customer.organization_id
    WHERE membership.customer_id = ${req.params.id};
  `;

  const backupQuery = `SELECT customer.*, organization.name AS "org_name", organization.discount_percent AS "org_discount_percent" FROM customer LEFT JOIN organization ON organization.organization_id = customer.organization_id WHERE customer_id = ${req.params.id};`;

  sql.query(query).then(data => {
    if (data.length) {
      res.send({
        query,
        data: data[0],
        length: data.length
      });
    } else {
      sql.query(backupQuery).then(data => {
        if (data.length) {
          res.send({
            query: backupQuery,
            data: data[0]
          });
        } else {
          res.status(404);
          res.send(`Customer with ID ${req.params.id} not found`);
        }
      }).catch(error => {
        res.status(400);
        res.send(error);
      });
    }
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/memberships`
 *
 * Return list of memberships
 */
router.get('/memberships', (req, res) => {
  const search = req.query.q;
  const activeOnly = req.query.active;
  let query = `SELECT membership.*, customer.*, membership_type.*, (membership_type.number_movie_tickets - (SELECT COUNT(*) from movie_ticket_purchase
      INNER JOIN membership ON movie_ticket_purchase.membership_id = membership.membership_id
      WHERE movie_ticket_purchase.pass_used = TRUE AND (movie_ticket_purchase.date_time BETWEEN membership.start_date AND membership.end_date)
    )) AS movie_tickets_left,
    (membership.end_date < CURDATE()) AS is_expired FROM membership
    LEFT JOIN customer ON customer.customer_id = membership.customer_id
    LEFT JOIN membership_type ON membership_type.membership_type_id = membership.membership_type_id `;

  if (search) {
    query = query + `WHERE (LOWER(customer.last_name) LIKE LOWER('%${search}%')) OR (LOWER(customer.first_name) LIKE LOWER('%${search}%')) OR (LOWER(customer.email) LIKE LOWER('%${search}%')) OR (LOWER(customer.phone) LIKE LOWER('%${search}%')) OR (LOWER(customer.address) LIKE LOWER('%${search}%')) `;
  }

  if (activeOnly) {
    query = query + 'AND `is_expired = 0 '
  }

  query = query + 'ORDER BY customer.last_name;';

  sql.query(query).then(data => {
    res.send({
      query,
      data
    })
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/memberships`
 *
 * Create membership transaction
 */
router.post('/memberships', (req, res) => {
  let queries = [
    `INSERT INTO membership (membership_type_id, customer_id, start_date, end_date, second_adult_name)
        VALUES (${req.body.membership_type_id}, ${req.body.customer_id} , "${req.body.start_date}", "${req.body.end_date}", ${req.body.second_adult_name ? `"${req.body.second_adult_name}"` : "NULL"});`,
    `INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
      VALUES (${req.body.customer_id}, ${req.body.employee_id}, LAST_INSERT_ID(), ${req.body.membership_type_id}, ${req.body.promotion_id ? `${req.body.promotion_id}` : "NULL"}, NOW(), "${req.body.total_paid}", "${req.body.payment_method}");`,
  ];

  if (req.body.membership_id) {
    queries = [
      `UPDATE membership SET membership_type_id = ${req.body.membership_type_id}, customer_id = ${req.body.customer_id}, start_date = "${req.body.start_date}", end_date = "${req.body.end_date}", second_adult_name = ${req.body.second_adult_name ? `"${req.body.second_adult_name}"` : "NULL"}
          WHERE membership_id = ${req.body.membership_id};`,
      `INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
        VALUES (${req.body.customer_id}, ${req.body.employee_id}, LAST_INSERT_ID(), ${req.body.membership_type_id}, ${req.body.promotion_id ? `${req.body.promotion_id}` : "NULL"}, NOW(), "${req.body.total_paid}", "${req.body.payment_method}");`,
    ];
  }

  const query = `START TRANSACTION;
    ${queries.filter(data => data)}
  COMMIT;`;

  sql.transaction(queries).then(data => {
    res.send({
      query,
      data
    })
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

module.exports = router;
