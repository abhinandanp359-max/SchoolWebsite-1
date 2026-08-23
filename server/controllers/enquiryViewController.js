/**
 * Enquiry type registry — the single place that knows how to resolve
 * any enquiry by its unique id. Supporting a future enquiry type only
 * requires adding an entry here (model + display type + update endpoint).
 */
const ENQUIRY_TYPES = [
  {
    key: 'admission',
    type: 'Admission Enquiry',
    model: require('../models/AdmissionEnquiry'),
    updateEndpoint: '/admissions',
  },
  {
    key: 'contact',
    type: 'Contact Enquiry',
    model: require('../models/ContactEnquiry'),
    updateEndpoint: '/contact',
  },
];

/**
 * GET /api/enquiries/:id/view  (protected)
 * Resolves the exact enquiry record by its unique id and reports its type.
 * Never matches on name/phone/email — id only.
 */
exports.viewEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry id' });
    }

    for (const entry of ENQUIRY_TYPES) {
      const enquiry = await entry.model.findById(id).lean();
      if (enquiry) {
        return res.json({
          success: true,
          data: {
            type: entry.type,
            typeKey: entry.key,
            updateEndpoint: entry.updateEndpoint,
            enquiry,
          },
        });
      }
    }

    return res.status(404).json({ success: false, message: 'Enquiry not found' });
  } catch (error) {
    next(error);
  }
};

exports.ENQUIRY_TYPES = ENQUIRY_TYPES;
