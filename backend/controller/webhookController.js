const LightFunnelsSession = require('../model/LightFunnelsSession.model');
const axios = require('axios');


const sendToAdClair = async (order) => {
    try {
        const url = process.env.ADCLAIR_URL;
        if (!url) {
            throw new Error("ADCLAIR_URL is not defined in environment variables.");
        }

        const response = await axios.post(`${url}/api/pixel/track`, order, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("AdClair API responded with an error:", {
                status: error.response.status,
                data: error.response.data,
            });
        } else if (error.request) {
            console.error("No response received from AdClair API:", error.request);
        } else {
            console.error("Error while sending order to AdClair:", error.message);
        }
    }
};

const getVariantDetails = (variants) => {
    let seenProductIds = new Set();

    return variants.map(variant => {
        if (seenProductIds.has(variant.product_id)) {
            return null; 
        }

        seenProductIds.add(variant.product_id);

        const quantity = variants.filter(v => v.product_id === variant.product_id).length;

        return {
            product_id: variant.product_id,
            price: variant.price,
            variant_id: variant.variant_id,
            quantity: quantity,
        };
    }).filter(item => item !== null);
}


const orderFunction = async (req, res) => {
    const node = req.body.node;
    const session = await LightFunnelsSession.findOne({ storeId: node.store_id });
    
    if(!session || !session.isActivated || !session.storeSelected) {
        return res.status(400).send('Store not found');
    }

    const object = {
        id: node.id,
        payementMethod: node.payments[0].source.payment_gateway.prototype.key,
        shupping_fee: node.shipping,
        subtotal_price: node.original_total,
        currency: node.currency,
        line_items: getVariantDetails(node.items),
        isCod: node.payments[0].source.payment_gateway.prototype.key === "cod" ? true : false,
        _utms: {

        },
        customer: {
            first_name: node.billing_address.first_name,
            last_name: node.billing_address.last_name,
            phone: node.billing_address.phone,
        },
        shop: session.storeName,
        source: "lightFunnels",
    }
    await sendToAdClair(object);
    res.status(200).send('Order received');
}

const uninstallFunction = async (req, res) => {
    console.log("UNINSTALL from here")
    res.status(200).send('Uninstall received');
}
 
module.exports = {
    orderFunction,
    uninstallFunction
};