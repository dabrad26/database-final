const express = require('express');

const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
});

/**
 * API Route: `/api/members`
 *
 * Return list of members
 */
router.get('/members', (req, res) => {
  res.send({test: 'API for members'});
});

module.exports = router;
