const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const productController = require('../controllers/productController');//new...
const {
    getTotalLoggedInCustomers
} = require('../controllers/customerController');

const { countTotalProductsBySeller } = require('../controllers/productController.js');
const User = require('../models/sellerSchema.js');
// Ensure getTotalProductQuantityByCustomer is defined in productController
const { getTotalProductQuantityByCustomer } = require('../controllers/productController');

router.get('/seller/:email', async (req, res) => {
    try {
        const email = req.params.email;
        // Fetch user ID using email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const sellerData = {
            name: "ramesh", // You can replace this with user.name if available
            email: user.email,
            shopName: "Srivinayagaagrocentre"
        };

        // Fetch total count of products added by the seller
        const totalProducts = await countTotalProductsBySeller(user._id);

        // Send response with seller data and total product count
        res.send({ sellerData, totalProducts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seller data', error });
    }
});


const {
    sellerRegister,
    sellerLogIn
} = require('../controllers/sellerController.js');

const {
    productCreate,
    getProducts,
    getProductDetail,
    searchProduct,
    searchProductbyCategory,
    searchProductbySubCategory,
    getSellerProducts,
    updateProduct,
    deleteProduct,
    deleteProducts,
    deleteProductReview,
    deleteAllProductReviews,
    addReview,
    getInterestedCustomers,
    getAddedToCartProducts,

   

} = require('../controllers/productController.js');

const {
    customerRegister,
    customerLogIn,
    getCartDetail,
    cartUpdate
} = require('../controllers/customerController.js');

const {
    newOrder,
    getOrderedProductsByCustomer,
    getOrderedProductsBySeller
} = require('../controllers/orderController.js');

const customerController = require('../controllers/customerController');//new.
// Seller
router.post('/SellerRegister', sellerRegister);
router.post('/SellerLogin', sellerLogIn);

// Product
router.post('/ProductCreate', productCreate);
router.get('/getSellerProducts/:id', getSellerProducts);
router.get('/getProducts', getProducts);
router.get('/getProductDetail/:id', getProductDetail);
router.get('/getInterestedCustomers/:id', getInterestedCustomers);
router.get('/getAddedToCartProducts/:id', getAddedToCartProducts);
//new....
const {
    countTotalProductsAddedByCustomers
} = require('../controllers/productController');
// Route for counting total products added by customers for a specific seller
router.get('/seller/:id/totalProducts', countTotalProductsAddedByCustomers);
//new......
router.put('/ProductUpdate/:id', updateProduct);
router.put('/addReview/:id', addReview);

router.get('/searchProduct/:key', searchProduct);
router.get('/searchProductbyCategory/:key', searchProductbyCategory);
router.get('/searchProductbySubCategory/:key', searchProductbySubCategory);

router.delete('/DeleteProduct/:id', deleteProduct);
router.delete('/DeleteProducts/:id', deleteProducts);
router.put('/deleteProductReview/:id', deleteProductReview);
router.delete('/deleteAllProductReviews/:id', deleteAllProductReviews);

// Customer
router.post('/CustomerRegister', customerRegister);
router.post('/CustomerLogin', customerLogIn);
router.get('/getCartDetail/:id', getCartDetail);
router.put('/CustomerUpdate/:id', cartUpdate);

router.get('/totalRegisteredCustomers', customerController.getTotalRegisteredCustomers);//new...
router.get('/totalLoggedInCustomers', getTotalLoggedInCustomers);//new..

// Order
router.post('/newOrder', newOrder);
router.get('/getOrderedProductsByCustomer/:id', getOrderedProductsByCustomer);
router.get('/getOrderedProductsBySeller/:id', getOrderedProductsBySeller);

// Add the provided code here
// New route for counting total products added by customers for a specific seller
router.get('/total-cart-quantity/:id', getTotalProductQuantityByCustomer);

module.exports = router;