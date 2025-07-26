import ExchangeServer from '../models/exchangeServer.model.js';
import CloudProvider from '../models/cloudProvider.model.js';
import ServerLocation from '../models/serverLocation.model.js';

export const getExchanges = async (req, res) => {
  try {
    const exchanges = await ExchangeServer.find({}, {
      exchangeId: 1,
      exchangeName: 1,
      baseCountry: 1,
      exchangeCode: 1,
      logoUrl: 1,
      _id: 0
    });
    res.json(exchanges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProviders = async (req, res) => {
  try {
    const providers = await CloudProvider.find({ isActive: true }, {
      ProviderId: 1,
      providerName: 1,
      regionName: 1,
      regionCode: 1,
      country: 1,
      _id: 0
    });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRegions = async (req, res) => {
  try {
    const regions = await ServerLocation.find({}, {
      locationId: 1,
      name: 1,
      alpha2: 1,
      region: 1,
      subregion: 1,
      _id: 0
    });
    res.json(regions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};