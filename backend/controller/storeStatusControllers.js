const jwt = require('jsonwebtoken');
const LightFunnelsSession = require('../model/LightFunnelsSession.model');

const updateStatusController = async (req, res) => {
    const { token, status } = req.body;

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const ownerId = decodedToken.account_id;
        const session = await LightFunnelsSession.findOne({ ownerId });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        session.isActivated = status;
        await session.save();

        return res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const getStatusController = async (req, res) => {
    const { token } = req.query;
    
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const ownerId = decodedToken.account_id;

        const session = await LightFunnelsSession.findOne({ ownerId });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        return res.status(200).json({ status: session.isActivated });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    updateStatusController,
    getStatusController,
};