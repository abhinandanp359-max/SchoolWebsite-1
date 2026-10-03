const express = require('express');
const router = express.Router();
const { createContact, getContacts, updateContact, exportContactsExcel, deleteContact, deleteContactsBulk } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.post('/', createContact);
router.get('/', protect, getContacts);
router.get('/export', protect, exportContactsExcel);
router.put('/:id', protect, updateContact);
router.delete('/', protect, deleteContactsBulk);
router.delete('/:id', protect, deleteContact);

module.exports = router;
