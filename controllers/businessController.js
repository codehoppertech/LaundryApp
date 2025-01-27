const Business = require('../models/Business');
const Location = require('../models/Location');
const PayJunction = require('../models/PayJunction');
const Hub = require('../models/Hub');
const Device = require('../models/Device');

// Create Business Name
// exports.createBusiness = async (req, res) => {
//   try {
//     console.log("10",req.body);
//     const { business_name } = req.body;

//     if (!business_name) {
//       return res.status(400).json({
//         status: 'error',
//         code: 400,
//         message: 'Missing or invalid business name.',
//         errors: null,
//       });
//     }

// const newBusiness = new Business({ business_name: business_name });
// console.log("23",newBusiness);
//     await newBusiness.save();

//     res.status(201).json({
//       status: 'success',
//       code: 201,
//       message: 'Business created successfully.',
//       data: {
//         business_id: newBusiness.business_id,
//       },
//       errors: null,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       code: 500,
//       message: 'Server error.',
//       errors: error.message,
//     });
//   }
// };

// // // Add Business Location
// // exports.addBusinessLocation = async (req, res) => {
// //   try {
// //     const {
// //       business_id,
// //       location_name,
// //       address_line_1,
// //       address_line_2,
// //       address_line_3,
// //       city,
// //       state,
// //       zipcode
// //     } = req.body;

// //     // Validate the input fields
// //     if (!business_id || !location_name || !address_line_1 || !city || !state || !zipcode) {
// //       return res.status(400).json({
// //         status: 'error',
// //         code: 400,
// //         message: 'Missing or invalid parameters.',
// //         errors: null,
// //       });
// //     }

// //     // Create a new Location document (no _id field)
// //     const newLocation = new Location({
// //       location_name: location_name,
// //       address_line_1: address_line_1,
// //       address_line_2: address_line_2,
// //       address_line_3: address_line_3,
// //       city,
// //       state,
// //       zipcode,
// //       businessId: business_id,  // Store business_id in businessId field of Location
// //     });

// //     // Save the new location to the database
// //     await newLocation.save();

// //     // Find the Business and add the new Location's _id to the locations array
// //    // const business = await Business.findOne({ business_id: business_id });

// //     // if (!business) {
// //     //   return res.status(404).json({
// //     //     status: 'error',
// //     //     code: 404,
// //     //     message: 'Business not found.',
// //     //     errors: null,
// //     //   });
// //     // }

// //     // Push the new location's _id to the Business' locations field
// //    // business.locations.push(newLocation._id);

// //     // Save the updated Business document
// //    // await business.save();

// //     res.status(201).json({
// //       status: 'success',
// //       code: 201,
// //       message: 'Business location added successfully.',
// //       data: {
// //         location_id: newLocation.location_id,
// //         business_id_id: newLocation.businessId
// //       },
// //       errors: null,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       status: 'error',
// //       code: 500,
// //       message: 'Server error.',
// //       errors: error.message,
// //     });
// //   }
// // };

// // // Add PayJunction Details
// // exports.addPayJunctionDetails = async (req, res) => {
// //   try {
// //     const { business_id, webshop_id, api_user, api_password } = req.body;

// //     if (!business_id || !webshop_id || !api_user || !api_password) {
// //       return res.status(400).json({
// //         status: 'error',
// //         code: 400,
// //         message: 'Missing or invalid parameters.',
// //         errors: null,
// //       });
// //     }

// //     const newPayJunction = new PayJunction({
// //       business_id: business_id,
// //       webshop_id: webshop_id,
// //       api_user: api_user,
// //       api_password: api_password,
// //     });
// //     await newPayJunction.save();

// //     res.status(200).json({
// //       status: 'success',
// //       code: 200,
// //       message: 'PayJunction details added successfully.',
// //       data: null,
// //       errors: null,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       status: 'error',
// //       code: 500,
// //       message: 'Server error.',
// //       errors: error.message,
// //     });
// //   }
// // };

// // // Connect or Purchase HUB
// // exports.connectOrPurchaseHub = async (req, res) => {
// //   try {
// //     const { business_id, hub_status } = req.body;

// //     if (!business_id || !hub_status || !['connect', 'purchase'].includes(hub_status)) {
// //       return res.status(400).json({
// //         status: 'error',
// //         code: 400,
// //         message: 'Missing or invalid parameters.',
// //         errors: null,
// //       });
// //     }

// //     const newHub = new Hub({
// //       business_id: business_id,
// //       hub_status: hub_status,
// //     });
// //     await newHub.save();

// //     res.status(200).json({
// //       status: 'success',
// //       code: 200,
// //       message: 'HUB action completed successfully.',
// //       data: {
// //         businessId: newHub.business_id,
// //         hubStatus: newHub.hub_status,
// //         hubId: newHub.hub_id
// //       },
// //       errors: null,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       status: 'error',
// //       code: 500,
// //       message: 'Server error.',
// //       errors: error.message,
// //     });
// //   }
// // };

// // // Add Device Information
// // exports.addDeviceInformation = async (req, res) => {
// //   try {
// //     const { business_id, mac_address, serial_number } = req.body;

// //     if (!business_id || !mac_address || !serial_number || !/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(mac_address)) {
// //       return res.status(400).json({
// //         status: 'error',
// //         code: 400,
// //         message: 'Missing or invalid parameters.',
// //         errors: null,
// //       });
// //     }

// //     const newDevice = new Device({
// //       business_id: business_id,
// //       macAddress: mac_address,
// //       serialNumber: serial_number,
// //     });
// //     await newDevice.save();

// //     res.status(201).json({
// //       status: 'success',
// //       code: 201,
// //       message: 'Device information added successfully.',
// //       data: null,
// //       errors: null,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       status: 'error',
// //       code: 500,
// //       message: 'Server error.',
// //       errors: error.message,
// //     });
// //   }
// // };


// // // Fetch All Business Locations
// // exports.fetchAllBusinessLocations = async (req, res) => {
// //   try {
// //     const { business_id } = req.params;

// //     if (!business_id) {
// //       return res.status(400).json({
// //         status: 'error',
// //         code: 400,
// //         message: 'Missing or invalid business_id.',
// //         errors: null,
// //       });
// //     }
// // console.log("254",business_id);
// // const business = await Business.findOne({ business_id: business_id }).populate('locations');
// //    // const business = await Business.findById(business_id).populate('locations');

// //     if (!business) {
// //       return res.status(404).json({
// //         status: 'error',
// //         code: 404,
// //         message: 'Business or locations not found.',
// //         errors: null,
// //       });
// //     }
// //     let location_name ='';
// //     business.locations.forEach(element => {
// //       location_name=element.location_name;
// //     });
// //     res.status(200).json({
// //       status: 'success',
// //       code: 200,
// //       message: 'Business locations fetched successfully.',
// //       data: {
// //         business_name: business.business_name,
// //         locations: business.locations
// //       },
// //       errors: null,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       status: 'error',
// //       code: 500,
// //       message: 'Server error.',
// //       errors: error.message,
// //     });
// //   }
// // };

// // // Add New Business Location
// // exports.addNewBusinessLocation = async (req, res) => {
// //   try {
// //     const { business_id, location_name, address_line_1, address_line_2, address_line_3, city, state, zipcode } = req.body;

// //     if (!business_id || !location_name || !address_line_1 || !city || !state || !zipcode) {
// //       return res.status(400).json({
// //         status: 'error',
// //         code: 400,
// //         message: 'Missing or invalid parameters.',
// //         errors: null,
// //       });
// //     }
// //     console.log("check");
// //     const business = await Business.findOne({ business_id: business_id });
// //     if (!business) {
// //       return res.status(404).json({
// //         status: 'error',
// //         code: 404,
// //         message: 'Business not found.',
// //         errors: null,
// //       });
// //     }
// //     console.log("business",business);
// //     const newLocation = new Location({
// //       businessId: business_id,
// //       location_name: location_name,
// //       address_line_1: address_line_1,
// //       address_line_2: address_line_2,
// //       address_line_3: address_line_3,
// //       city,
// //       state,
// //       zipcode,
// //     });
// //     await newLocation.save();
// // console.log("check",newLocation.location_id);
// // console.log("check",business.locations);
// //     business.locations.push(newLocation._id);
// //     await business.save();

// //     res.status(201).json({
// //       status: 'success',
// //       code: 201,
// //       message: 'New business location added successfully.',
// //       data: {
// //         location_id: newLocation.location_id,
// //         location_name: newLocation.locationName,
// //         address_line_1: newLocation.addressLine1,
// //         city: newLocation.city,
// //         state: newLocation.state,
// //         zipcode: newLocation.zipcode,
// //       },
// //       errors: null,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       status: 'error',
// //       code: 500,
// //       message: 'Server error.',
// //       errors: error.message,
// //     });
// //   }
// // };


// exports.createBusiness = async (req, res) => {
//   try {
//     const { business_name, owner } = req.body;

//     // Check that all required fields are present
//     if (!business_name || !owner) {
//       return res.status(400).json({ message: "Business name and owner are required." });
//     }

//     // Create new business
//     const newBusiness = new Business({
//       business_name,
//       owner: {
//         user_id: owner.user_id,
//         name: owner.name,
//         email: owner.email
//       }
//     });

//     // Save the business to MongoDB
//     const savedBusiness = await newBusiness.save();

//     return res.status(201).json(savedBusiness);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error creating business", error: error.message });
//   }
// };
exports.addBusinessLocation =async (req, res) => {
  try {
    const { business_id, location_name, address_line_1, city, state, zipcode } = req.body;

    // Validate that the required fields are present
    if (!business_id || !location_name || !address_line_1 || !city || !state || !zipcode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create the location document
    const newLocation = new Location({
      business_id,
      location_name,
      address_line_1,
      city,
      state,
      zipcode
    });

    // Save the location to the database
    const savedLocation = await newLocation.save();
    return res.status(201).json(savedLocation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating location", error: error.message });
  }
};
// // Fetch all locations for a business
// exports.fetchAllBusinessLocations = async (req, res) => {
//   const { business_id } = req.params;
//   try {
//     const locations = await Location.find({ business_id });
//     res.status(200).json(locations);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Add a new location for a business
exports.addNewBusinessLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// // Add PayJunction details (dummy implementation for now)
// exports.addPayJunctionDetails = async (req, res) => {
//   try {
//     // Logic to add PayJunction details goes here
//     res.status(200).json({ message: 'PayJunction details added successfully' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Connect or purchase a hub (dummy implementation for now)
// exports.connectOrPurchaseHub = async (req, res) => {
//   try {
//     // Logic to connect or purchase a hub goes here
//     res.status(200).json({ message: 'Hub connected or purchased successfully' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Add device information (dummy implementation for now)
// exports.addDeviceInformation = async (req, res) => {
//   try {
//     // Logic to add device information goes here
//     res.status(200).json({ message: 'Device information added successfully' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
//const Business = require('../models/business');
//const Location = require('../models/location');

exports.createBusiness = async (req, res) => {
  try {
    const { business_name, owner } = req.body;

    if (!business_name || !owner) {
      return res.status(400).json({ message: "Business name and owner are required." });
    }

    const newBusiness = new Business({
      business_name,
      owner: {
        user_id: owner.user_id,
        name: owner.name,
        email: owner.email
      }
    });

    const savedBusiness = await newBusiness.save();
    return res.status(201).json(savedBusiness);
  } catch (error) {
    return res.status(500).json({ message: "Error creating business", error: error.message });
  }
};

exports.fetchAllBusinessLocations = async (req, res) => {
  try {
    const { business_id } = req.params;
    const locations = await Location.find({ business_id });

    return res.status(200).json(locations);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching locations", error: error.message });
  }
};

exports.addNewBusinessLocation = async (req, res) => {
  try {
    const { business_id, location_name, address_line_1, city, state, zipcode } = req.body;

    if (!business_id || !location_name || !address_line_1 || !city || !state || !zipcode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newLocation = new Location({
      business_id,
      location_name,
      address_line_1,
      city,
      state,
      zipcode
    });

    const savedLocation = await newLocation.save();
    return res.status(201).json(savedLocation);
  } catch (error) {
    return res.status(500).json({ message: "Error adding location", error: error.message });
  }
};


// Add PayJunction details (dummy implementation for now)
exports.addPayJunctionDetails = async (req, res) => {
  try {
    // Logic to add PayJunction details goes here
    res.status(200).json({ message: 'PayJunction details added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Connect or purchase a hub (dummy implementation for now)
exports.connectOrPurchaseHub = async (req, res) => {
  try {
    // Logic to connect or purchase a hub goes here
    res.status(200).json({ message: 'Hub connected or purchased successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add device information (dummy implementation for now)
exports.addDeviceInformation = async (req, res) => {
  try {
    // Logic to add device information goes here
    res.status(200).json({ message: 'Device information added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Add a new location for a business
exports.addNewBusinessLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};