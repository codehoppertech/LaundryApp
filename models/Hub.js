 const mongoose = require('mongoose');
// const hubSchema = new mongoose.Schema({
//   business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
//   hub_status: { type: String, required: true, enum: ['connect', 'purchase'] },
//   hub_id:{type: String, unique: true },
//   ports: [
//     {
//       port_id: { type: String, required: true },
//       port_name: { type: String, required: true },
//       status: { type: String, required: true, enum: ['available', 'occupied'] },
//       connected_machine: {
//         machine_id: { type: String },
//         machine_name: { type: String }
//       }
//     }
//   ]
// });
// hubSchema.pre('save', function (next) {
//   if (!this.hub_id) {
//     // Generate a random number (this could be any format you want)
//     const randomBusinessId = `HUB-${Math.floor(Math.random() * 1000000) + 100000}`;
//     this.hub_id = randomBusinessId;
//   }
//   next();
// });
// module.exports = mongoose.model('Hub', hubSchema);

//const mongoose = require('mongoose');

// const hubSchema = new mongoose.Schema({
//   location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
//   business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
//   hub_status: { type: String, required: true, enum: ['connect', 'purchase'] },
//   name: { type: String, required: true },
//   description: { type: String },
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Hub', hubSchema);



const hubSchema = new mongoose.Schema({
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  hub_status: { type: String, required: true, enum: ['connect', 'purchase'] },
  name: { type: String, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  hub_id: { type: mongoose.Schema.Types.ObjectId, unique: true, default: () => new mongoose.Types.ObjectId() }
});

module.exports = mongoose.model('Hub', hubSchema);
