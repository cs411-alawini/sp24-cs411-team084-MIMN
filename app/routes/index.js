const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Welcome to Our Recommendation System',
    recommendations: [],
    applicants: []
  });
});

/* POST recommendation request */
router.post('/', function(req, res) {
  const gre_q = parseInt(req.body.gre_q);
  const gre_v = parseInt(req.body.gre_v);
  const gre_awa = parseFloat(req.body.gre_awa);
  const gpa = parseFloat(req.body.gpa);

  if (gpa < 0 || gpa > 4 || isNaN(gpa) ||
      gre_v < 130 || gre_v > 170 || isNaN(gre_v) ||
      gre_q < 130 || gre_q > 170 || isNaN(gre_q) ||
      gre_awa < 0 || gre_awa > 6 || isNaN(gre_awa)) {
    res.render('index', {
      title: 'Error in Recommendations',
      recommendations: 'Invalid input detected, please enter valid scores.',
      applicants: [],
      user_input: req.body
    });
    return;
  }

  const args = [
    gre_q,
    gre_v,
    gre_awa,
    gpa,
    `"${req.body.status_app}"`  // Ensure the argument is properly quoted if it could contain spaces
  ].join(" ");

  const command = `python3 public/model/recommender.py ${args}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error}`);
      res.render('index', {
        title: 'Error in Recommendations',
        recommendations: `Failed to generate recommendations: ${stderr}`,
        applicants: [],
        user_input: req.body
      });
    } else {
      const parts = stdout.split('---Applicants---');
      const recommendations = parts[0] ? parts[0].trim().split('\n').filter(line => line) : [];
      const applicants = parts[1] ? parts[1].trim().split('\n').filter(line => line) : [];

      res.render('index', {
        title: 'Recommendations',
        recommendations: recommendations.length ? recommendations.join(', ') : 'No recommendations found.',
        applicants: applicants,
        user_input: req.body
      });
    }
  });
});

module.exports = router;

