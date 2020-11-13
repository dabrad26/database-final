const express = require('express');

const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
});

// Get List of all current members
router.get('/members', (req, res) => {
  res.send({test: 'API for members'});
});

module.exports = router;
