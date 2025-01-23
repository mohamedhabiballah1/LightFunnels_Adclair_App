const axios = require('axios');
const LightFunnelsSession = require('../model/LightFunnelsSession.model');
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

const validateEnvVariables = () => {
    const requiredVars = ['CLIENT_ID', 'CLIENT_SECRET', 'BASE_URL', 'SCOPES', 'JWT_SECRET', 'FRONTEND_URL'];
    requiredVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Environment variable ${key} is not set.`);
        }
    });
};
 
const createWebhook = async (account, url, event) => {
    try {
        const data = {
            query: `mutation webhooksCreateMutation($node: WebhookInput!) {
                createWebhook(node: $node) {
                    type
                    url
                }
            }`,
            variables: { node: { type: event, url, settings: {} } },
        };

        const config = {
            method: 'post',
            url: 'https://services.lightfunnels.com/api/v2',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${account.accessToken}`,
            },
            data: JSON.stringify(data),
        };

        const response = await axios(config);
        console.log(`Webhook for ${event} created successfully:`, response.data);
    } catch (error) {
        console.error(`Failed to create webhook for ${event}:`, error.message);
    }
};

const getAccountData = async (accessToken) => {
    try {
        const response = await axios.post(
            'https://services.lightfunnels.com/api/v2',
            {
                query: `
                query accountQuery {
                    account {
                        id
                        account_name
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

        return response.data.data || null;
    } catch (error) {
        console.error('Error retrieving account data:', error.message);
        return null;
    }
};

const authFunction = async (req, res) => {
    try {
        validateEnvVariables();

        const clientId = process.env.CLIENT_ID;
        const backendUrl = process.env.BASE_URL;
        const scopes = process.env.SCOPES;

        const redirectUri = `https://app.lightfunnels.com/admin/oauth?client_id=${clientId}&redirect_uri=${backendUrl}/auth/redirect&scope=${scopes}&state=123`;

        return res.redirect(redirectUri);
    } catch (error) {
        console.error('Error in authFunction:', error.message);
        return res.status(500).send('Failed to initiate authentication.');
    }
};

const redirectFunction = async (req, res) => {
    try {
        validateEnvVariables();

        const code = req.query.code;
        if (!code) {
            return res.status(400).send('Authorization code is required.');
        }

        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;

        const tokenResponse = await axios.post('https://api.lightfunnels.com/oauth/access_token', {
            client_id: clientId,
            client_secret: clientSecret,
            code,
        });

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(401).send('Failed to retrieve access token.');
        }

        const accountData = await getAccountData(accessToken);
        if (!accountData) {
            return res.status(500).send('Failed to retrieve account data.');
        }

        const { id: ownerId, account_name: storeName } = accountData.account;

        let lightFunnelsSession = await LightFunnelsSession.findOne({ ownerId });

        if (!lightFunnelsSession) {
            lightFunnelsSession = new LightFunnelsSession({
                ownerId,
                accessToken,
                storeName,
            });
            await lightFunnelsSession.save();
            await createWebhook(lightFunnelsSession, `${process.env.BASE_URL}/webhook/order`, 'order/confirmed');
            await createWebhook(lightFunnelsSession, `${process.env.BASE_URL}/webhook/uninstall`, 'app/uninstalled');
        } else {
            lightFunnelsSession.accessToken = accessToken;
            lightFunnelsSession.storeName = storeName;
            await lightFunnelsSession.save();
        }

        const token = jsonwebtoken.sign(
            { account_id: ownerId },
            process.env.JWT_SECRET,
        ); 
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}&ownerId=${ownerId}`);
    } catch (error) {
        console.error('Error in redirectFunction:', error.message);
        return res.status(500).send('An unexpected error occurred.');
    }
};

module.exports = {
    authFunction,
    redirectFunction,
};
