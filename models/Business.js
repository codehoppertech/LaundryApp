const BusinessSchema = new mongoose.Schema({
    business_name: { type: String, required: true },
    locations: [{
      location_name: String,
      address_line_1: String,
      address_line_2: String,
      address_line_3: String,
      city: String,
      state: String,
      zipcode: String,
    }],
  });