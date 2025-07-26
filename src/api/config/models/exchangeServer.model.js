import mongoose from 'mongoose';

const ExchangeServerSchema = new mongoose.Schema({
  exchangeId: String,
  baseCountry: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  exchangeCode: {
    type: String,
    unique: true
  },
  exchangeName: String,
  preferredRegions: [String],
  logoUrl: String,
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance'],
    default: 'online'
  },
  lastPing: Date
}, { collection: 'Exchange Servers' });

export default mongoose.model('ExchangeServer', ExchangeServerSchema);