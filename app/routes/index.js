const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Welcome to Our Recommendation System',
    recommendations: []
  });
});

/* POST recommendation request */
router.post('/', function(req, res) {
  const args = [
    req.body.gre_q,
    req.body.gre_v,
    req.body.gre_awa,
    req.body.gpa,
    `"${req.body.status_app}"`  // Ensure the argument is properly quoted if it could contain spaces
  ].join(" ");

  const command = `python3 recommender.py ${args}`;
  console.log("Executing command:", command); // This log will help you verify the correct command

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error}`);
      res.render('index', {
        title: 'Error in Recommendations',
        recommendations: `Failed to generate recommendations: ${stderr}`,
        user_input: req.body
      });
    } else {
      console.log(`stdout: ${stdout}`);
      const results = stdout ? stdout.split('\n').filter(line => line) : []; // Filter empty lines if necessary
      res.render('index', {
        title: 'Recommendations',
        recommendations: results.length ? results.join(', ') : 'No recommendations found.',
        user_input: req.body
      });
    }
  });
});

module.exports = router;
