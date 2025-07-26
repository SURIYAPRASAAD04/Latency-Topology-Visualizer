import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
  id: String,
  exchangeId: String,
  exchangeName: String,
  regionId: String,
  regionName: String,
  provider: String,
  latency: Number,
  quality: String,
  color: String,
  startLat: Number,
  startLng: Number,
  endLat: Number,
  endLng: Number
});

export default mongoose.model('Connection', connectionSchema);
