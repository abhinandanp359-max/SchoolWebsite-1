const express = require('express');
const router = express.Router();
const { createAdmission, getAdmissions, updateAdmission, exportAdmissionsExcel } = require('../controllers/admissionController');
const { protect } = require('../middleware/auth');

router.post('/', createAdmission);
router.get('/', protect, getAdmissions);
router.get('/export', protect, exportAdmissionsExcel);
router.put('/:id', protect, updateAdmission);

module.exports = router;
