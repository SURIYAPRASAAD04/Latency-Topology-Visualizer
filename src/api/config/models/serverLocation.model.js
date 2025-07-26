import mongoose from 'mongoose';

const ServerLocationSchema = new mongoose.Schema({
  locationId: String,
  alpha2: String,
  latitude: String,
  longitude: String,
  name: String,
  region: String,
  subregion: String
});

const ServerLocation = mongoose.model('ServerLocation', ServerLocationSchema, 'Server Locations');

export default ServerLocation;