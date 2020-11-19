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

module.exports = router;
