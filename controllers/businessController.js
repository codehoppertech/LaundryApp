const Business = require('../models/Business');

exports.createBusiness = async (req, res) => {
  try {
    console.log("body",req.body);
    const { business_name } = req.body;
    const business = new Business({ business_name });
    await business.save();
    res.status(201).json({ message: 'Business created successfully', business });
  } catch (err) {
    res.status(500).json({ message: 'Error creating business', error: err.message });
  }
};

exports.addLocation = async (req, res) => {
  try {
    const { business_id, location_name, address_line_1, city, state, zipcode } = req.body;
    const business = await Business.findById(business_id);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    business.locations.push({ location_name, address_line_1, city, state, zipcode });
    await business.save();
    res.status(201).json({ message: 'Location added successfully', business });
  } catch (err) {
    res.status(500).json({ message: 'Error adding location', error: err.message });
  }
};