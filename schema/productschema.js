//schema
const mongoose = require('mongoose');

// Define the Data schema
const dataSchema = new mongoose.Schema({
  name: String,
  phone : String, 
  create_date : String, 
  create_time : String,
  wallet_amount : String,
  wallet_amount_updatedby : String,
  status : String,
  email : String,
  dob : String,
  gender : String,
  currency : String,
  address : String,
  customer_type : String ,
  photoUrls: [String],
}, { collection: 'test_details' });

const Data = mongoose.model('Data', dataSchema);
module.exports = Data;
