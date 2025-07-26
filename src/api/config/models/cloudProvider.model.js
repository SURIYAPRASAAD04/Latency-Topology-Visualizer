import mongoose from 'mongoose';

const CloudProviderSchema = new mongoose.Schema({
  ProviderId: String,
  providerName: String,
  locationType: String,
  regionName: String,
  regionCode: String,
  country: String,
  city: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  alpha2: String,
  isActive: Boolean,
  availableCapacity: Number
});

const CloudProvider = mongoose.model('CloudProvider', CloudProviderSchema, 'Cloud Providers');


export default CloudProvider;