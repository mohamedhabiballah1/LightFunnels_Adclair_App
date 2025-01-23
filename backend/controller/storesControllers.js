const axios = require('axios');
const LightFunnelsSession = require('../model/LightFunnelsSession.model');

const selectStoreFunction = async (req, res) => {
    try {
        const lightFunnels = await LightFunnelsSession.find();
        if (lightFunnels.length > 0) {
            const storeSelected = lightFunnels[0].storeSelected;
            return res.send(storeSelected);
        } else {
            return res.send('No LightFunnel models found');
        }
    } catch (error) {
        console.error(error);
        return res.send('Error');
    }
}

const listStoresFunction = async (req, res) => {
    try {
        const lightFunnelsSessions = await LightFunnelsSession.find();

        if (lightFunnelsSessions.length === 0) {
            return res.status(404).send('No LightFunnel sessions found');
        }

        const accessToken = lightFunnelsSessions[0].accessToken;

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

        if (response.data && response.data.data?.account?.stores) {
            const stores = response.data.data.account.stores;
            return res.status(200).json(stores);
        } else {
            return res.status(500).send('Failed to fetch stores. Please try again later.');
        }
    } catch (error) {
        return res.status(500).send('An error occurred while fetching stores.');
    }
};

const selectingFunction = async (req, res) => {
    try {
        const { store } = req.body;
        const session = await LightFunnelsSession.findOne();
        
        if (!session) {
            return res.status(404).send('No LightFunnels session found');
        }

        session.storeSelected = true;
        session.storeName = store.name;
        session.storeId = store.id;

        await session.save();
        return res.status(200).send('Store selected successfully');
    } catch (error) {
        console.error('Error occurred while selecting store:', error);
        return res.status(500).send('An error occurred while selecting the store.');
    }
};


module.exports = {
    selectStoreFunction,
    listStoresFunction,
    selectingFunction
};