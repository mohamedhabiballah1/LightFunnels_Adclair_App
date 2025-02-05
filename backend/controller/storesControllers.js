const axios = require('axios');
const jwt = require('jsonwebtoken');
const LightFunnelsSession = require('../model/LightFunnelsSession.model');

const selectStoreFunction = async (req, res) => {
    try {
        const token = req.query.token;
        if (!token) return res.status(400).send('Token is required');
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const ownerId = decodedToken.account_id;

        const lightFunnels = await LightFunnelsSession.findOne({ ownerId });
        if (!lightFunnels) {
            return res.status(404).send('No LightFunnel models found');
        }
        return res.json({ storeSelected: lightFunnels.storeSelected });
    } catch (error) {
        return res.status(500).send('Error selecting store');
    }
};

const listStoresFunction = async (req, res) => {
    try {
        const token = req.query.token;
        if (!token) return res.status(400).send('Token is required');

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const ownerId = decodedToken.account_id;

        const lightFunnels = await LightFunnelsSession.findOne({ ownerId });
        if (!lightFunnels) {
            return res.status(404).send('No LightFunnels session found');
        }

        const accessToken = lightFunnels.accessToken;
        console.log('Access Token:', accessToken);
        
        const response = await axios.post(
            'https://services.lightfunnels.com/api/v2',
            {
                query: `
                    query AccountQuery {
                        account {
                            stores {
                                id
                                name
                            }
                        }
                    }
                `,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data?.data?.account?.stores) {
            return res.status(200).json(response.data.data.account.stores);
        } else {
            return res.status(500).send('Failed to fetch stores. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching stores:', error);
        return res.status(500).send('An error occurred while fetching stores.');
    }
};

const selectingFunction = async (req, res) => {
    try {
        const { store } = req.body;
        const token = req.query.token;

        if (!store || !store.id || !store.name) {
            return res.status(400).send('Store ID and name are required');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const ownerId = decodedToken.account_id;

        const session = await LightFunnelsSession.findOneAndUpdate(
            { ownerId },
            { 
                storeSelected: true,
                storeName: store.name,
                storeId: store.id
            },
            { new: true }
        );

        if (!session) {
            return res.status(404).send('No LightFunnels session found');
        }

        return res.status(200).send('Store selected successfully');
    } catch (error) {
        return res.status(500).send('An error occurred while selecting the store.');
    }
};

module.exports = {
    selectStoreFunction,
    listStoresFunction,
    selectingFunction
};
