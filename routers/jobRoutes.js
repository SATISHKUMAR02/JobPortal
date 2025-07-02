const express = require('express');
const jobcontroller = require('../controllers/jobController');
const router = express.Router();

router.get('/get-all-jobs', jobcontroller.getAllJobs);
router.post('/create-jobs', jobcontroller.createjobs);
router.put('/update-jobs/:id', jobcontroller.updateJob);
router.delete('/delete-jobs/:id', jobcontroller.deleteJob);
router.get('/job-stats',jobcontroller.jobStats);
router.get('/job-stats-status',jobcontroller.getAllJobsByStatus);
router.get('/job-stats-worktype',jobcontroller.getAllJobsByworktype);
module.exports = router;
