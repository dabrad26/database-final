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
        data: data[0]
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
  let query = `SELECT * from membership_list `;

  if (search) {
    query = query + `WHERE (LOWER(last_name) LIKE LOWER('%${search}%')) OR (LOWER(first_name) LIKE LOWER('%${search}%')) OR (LOWER(email) LIKE LOWER('%${search}%')) OR (LOWER(phone) LIKE LOWER('%${search}%')) OR (LOWER(address) LIKE LOWER('%${search}%')) `;
  }

  if (activeOnly) {
    query = query + `HAVING \`is_expired\` = 0 `;
  }

  query = query + 'ORDER BY last_name;';

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
 * API Route: `/api/memberships/:id`
 *
 * Return specific membership
 */
router.get('/memberships/:id', (req, res) => {
  let query = `SELECT * FROM membership_list WHERE membership_id = ${req.params.id};`;

  sql.query(query).then(data => {
    res.send({
      query,
      data: data[0]
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
      `UPDATE membership SET membership_type_id = ${req.body.membership_type_id}, customer_id = ${req.body.customer_id}, start_date = CURDATE(), end_date = "${req.body.end_date}", second_adult_name = ${req.body.second_adult_name ? `"${req.body.second_adult_name}"` : "NULL"}
        WHERE membership_id = ${req.body.membership_id};`,
      `INSERT INTO membership_purchase (customer_id, employee_id, membership_id, membership_type_id, promotion_id, date_time, total_paid, payment_method)
        VALUES (${req.body.customer_id}, ${req.body.employee_id}, ${req.body.membership_id}, ${req.body.membership_type_id}, ${req.body.promotion_id ? `${req.body.promotion_id}` : "NULL"}, NOW(), "${req.body.total_paid}", "${req.body.payment_method}");`,
    ];
  }

  const query = `START TRANSACTION;
    ${queries.filter(data => data).join('\n')}
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

/**
 * API Route: `/api/incentives`
 *
 * Return list of incentives by employee
 */
router.get('/incentives', (req, res) => {
  const startDate = req.query.start_date;
  const endDate = req.query.end_date;
  let query = `SELECT employee.*, SUM(membership_type.employee_incentive) AS "total_earned", COUNT(*) AS "total_sold"
    FROM membership_purchase
    LEFT JOIN employee ON employee.employee_id = membership_purchase.employee_id
    LEFT JOIN membership_type ON membership_purchase.membership_type_id = membership_type.membership_type_id
    WHERE CAST(membership_purchase.date_time AS DATE) BETWEEN "${startDate}" AND "${endDate}"
    GROUP BY employee.employee_id
    ORDER BY "total_earned";`;

  if (!startDate || !endDate) {
    res.status(400);
    res.send({message: 'Missing start or end date query'});
  }

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
 * API Route: `/api/movie_tickets`
 *
 * Return specific list of movie tickets
 */
router.get('/movie_tickets', (req, res) => {
  const query = `SELECT movie_ticket_purchase.*, movie.name FROM movie_ticket_purchase
    LEFT JOIN movie ON movie_ticket_purchase.movie_id = movie.movie_id
    WHERE movie_ticket_purchase.membership_id = ${req.query.membership}
    ORDER BY movie_ticket_purchase.date_time DESC;
  `;

  sql.query(query).then(data => {
    res.send({
      query,
      data
    });
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/movie_tickets`
 *
 * Return specific list of movie tickets
 */
router.post('/movie_tickets', (req, res) => {
  const query = `INSERT INTO movie_ticket_purchase (movie_id, membership_id, date_time, pass_used, ticket_price)
    VALUES (${req.body.movie_id}, ${req.body.membership_id}, NOW(), ${req.body.pass_used}, ${req.body.ticket_price});`;

  sql.query(query).then(data => {
    res.send({
      query,
      data
    });
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/movie_tickets`
 *
 * Return list of movie tickets
 */
router.get('/current_movies', (req, res) => {
  const query = `SELECT * FROM movie WHERE end_date IS NULL OR end_date > CURDATE() ORDER BY name;`;

  sql.query(query).then(data => {
    res.send({
      query,
      data
    });
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/benefits`
 *
 * Return list of benefits
 */
router.get('/benefits', (req, res) => {
  const query = `SELECT * FROM benefit ORDER BY name;`;

  sql.query(query).then(data => {
    res.send({
      query,
      data
    });
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/benefits_used`
 *
 * Return specific list of movie tickets
 */
router.get('/benefits_used', (req, res) => {
  const query = `SELECT benefit_used.*, benefit.name, benefit.discount FROM benefit_used
    LEFT JOIN benefit ON benefit_used.benefit_id = benefit.benefit_id
    WHERE benefit_used.membership_id = ${req.query.membership}
    ORDER BY benefit_used.date_time DESC;
  `;

  sql.query(query).then(data => {
    res.send({
      query,
      data
    });
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/benefits_used`
 *
 * Create sold movie ticket
 */
router.post('/benefits_used', (req, res) => {
  const query = `INSERT INTO benefit_used (benefit_id, membership_id, date_time, price_paid)
    VALUES (${req.body.benefit_id}, ${req.body.membership_id}, NOW(), ${req.body.price_paid});`;

  sql.query(query).then(data => {
    res.send({
      query,
      data
    });
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/events`
 *
 * Return list of events that are happening or coming up
 */
router.get('/events', (req, res) => {
  const query = `SELECT * FROM special_event
    WHERE CAST(date_time AS DATE) >= CURDATE()
    ORDER BY date_time ASC;`;

  sql.query(query).then(data => {
    res.send({
      query,
      data
    });
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/events_attended`
 *
 * Return specific list of special events attended
 */
router.get('/events_attended', (req, res) => {
  const query = `SELECT event_attended.*, special_event.name, special_event.location FROM event_attended
    LEFT JOIN special_event ON event_attended.special_event_id = special_event.special_event_id
    WHERE event_attended.membership_id = ${req.query.membership}
    ORDER BY special_event.date_time DESC;
  `;

  sql.query(query).then(data => {
    res.send({
      query,
      data
    });
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

/**
 * API Route: `/api/events_attended`
 *
 * Create special event
 */
router.post('/events_attended', (req, res) => {
  const query = `INSERT INTO event_attended (special_event_id, membership_id, number_attendees)
    VALUES (${req.body.special_event_id}, ${req.body.membership_id}, ${req.body.number_attendees});`;

  sql.query(query).then(data => {
    res.send({
      query,
      data
    });
  }).catch(error => {
    res.status(400);
    res.send(error);
  })
});

module.exports = router;
