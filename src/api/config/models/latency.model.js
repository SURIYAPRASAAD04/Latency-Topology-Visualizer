import mongoose from 'mongoose';

const latencySchema = new mongoose.Schema({
  connectionId: { type: String, required: true },
  latency: { type: Number, required: true },
  quality: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const LatencyTracking = mongoose.model('LatencyTracking', latencySchema);
export default LatencyTracking;

