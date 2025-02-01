const Business = require("../models/Business");

exports.createBusiness = async (req, res) => {
  try {
    const { businessName } = req.body;
    const ownerId = req.user.id; // Extract from auth middleware

    const business = new Business({ businessName, ownerId });
    await business.save();

    res.status(201).json({ businessId: business._id, businessName });
  } catch (error) {
    res.status(500).json({ message: "Error creating business." });
  }
};

exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ ownerId: req.user.id });
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching businesses." });
  }
};
