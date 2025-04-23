"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const customer_controller_1 = require("./customer.controller");
const multer_config_1 = require("../../config/multer.config");
const customer_validation_1 = require("./customer.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.admin), customer_controller_1.CustomerControllers.getAllCustomers)
    .patch((0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.customer), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(customer_validation_1.customerValidationsSchema.updateCustomerValidatonSchema), customer_controller_1.CustomerControllers.updateCustomer);
router.get('/my-preferences', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), customer_controller_1.CustomerControllers.getCustomerPreferences);
router
    .route('/:id')
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.admin), customer_controller_1.CustomerControllers.getSingleCustomer)
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.admin), customer_controller_1.CustomerControllers.deleteCustomer);
exports.default = router;
