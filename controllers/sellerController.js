const bcrypt = require('bcrypt');
const Seller = require('../models/sellerSchema.js');
const { createNewToken } = require('../utils/token.js');

const fixedValues = {
    name: "ramesh",
    email: "ramesh@gmail.com",
    shopName: "Srivinayagaagrocentre"
};

const sellerRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        // Check if the fixed values are provided
        const isValidEntry = Object.keys(fixedValues).every(key => {
            return req.body.hasOwnProperty(key) && req.body[key] === fixedValues[key];
        });

        if (!isValidEntry) {
            return res.send({ message: 'INVALID ENTRY' });
        }

        const seller = new Seller({
            ...fixedValues,
            password: hashedPass
        });

        const existingSellerByEmail = await Seller.findOne({ email: fixedValues.email });
        const existingShop = await Seller.findOne({ shopName: fixedValues.shopName });

        if (existingSellerByEmail) {
            return res.send({ message: 'Email already exists' });
        }
        else if (existingShop) {
            return res.send({ message: 'Shop name already exists' });
        }
        else {
            let result = await seller.save();
            result.password = undefined;

            const token = createNewToken(result._id)

            result = {
                ...result._doc,
                token: token
            };

            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const sellerLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        if (req.body.email !== fixedValues.email) {
            return res.send({ message: 'INVALID ENTRY' });
        }

        let seller = await Seller.findOne({ email: fixedValues.email });
        if (seller) {
            const validated = await bcrypt.compare(req.body.password, seller.password);
            if (validated) {
                seller.password = undefined;

                const token = createNewToken(seller._id)

                seller = {
                    ...seller._doc,
                    token: token
                };

                res.send(seller);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};


module.exports = { sellerRegister, sellerLogIn };