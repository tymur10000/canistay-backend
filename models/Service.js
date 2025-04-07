const mongoose = require("mongoose");

const Service = mongoose.model("services", {
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // group_id: {
  //   // Reference to the User model
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "service_groups",
  //   required: true,
  // },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Service;

// const Service = [
//   {id: 1, label: 'Wi-Fi'},
//   {id: 2, label: 'Heating and air conditioning'},
//   {id: 3, label: 'Hot water'},
//   {id: 4, label: 'Bed linens and towels'},
//   {id: 5, label: 'Electricity and lighting'},
//   {id: 6, label: 'Full kitchen'},
//   {id: 7, label: 'Coffee maker'},
//   {id: 8, label: 'Microwave'},
//   {id: 9, label: 'Television'},
//   {id: 10, label: 'Streaming services'},
//   {id: 11, label: 'Washer and dryer'},
//   {id: 12, label: 'Hairdryer'},
//   {id: 13, label: 'Swimming pool'},
//   {id: 14, label: 'Parking'},
//   {id: 15, label: 'Pet-friendly'},
//   {id: 16, label: 'Workspace'},
//   {id: 17, label: 'BBQ grill'},
//   {id: 18, label: 'Garden'},
//   {id: 19, label: 'Balcony'},
//   {id: 20, label: 'Security system'}
// ];

module.exports = Service;
