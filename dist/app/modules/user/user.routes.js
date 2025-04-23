"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const customer_validation_1 = require("../customer/customer.validation");
const admin_validation_1 = require("../admin/admin.validation");
const provider_validation_1 = require("../provider/provider.validation");
const user_constant_1 = require("./user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.route('/create-customer').post(multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(customer_validation_1.customerValidationsSchema.createCustomerValidatonSchema), user_controller_1.UserControllers.createCustomer);
router.route('/create-provider').post(multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(provider_validation_1.ProviderValidationsSchema.createProviderValidatonSchema), user_controller_1.UserControllers.createProvider);
router.route('/create-admin').post(multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(admin_validation_1.AdminValidationSchema.createAdminValidationSchema), user_controller_1.UserControllers.createAdmin);
router.post('/change-status/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(user_validation_1.UserValidation.changeStatusValidationSchema), user_controller_1.UserControllers.changeStatus);
router.get('/me', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.provider, user_constant_1.USER_ROLE.customer), user_controller_1.UserControllers.getMe);
exports.default = router;
