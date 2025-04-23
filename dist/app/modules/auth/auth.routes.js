"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router
    .route('/login')
    .post((0, validateRequest_1.default)(auth_validation_1.authValidations.loginValidationSchema), auth_controller_1.AuthControllers.loginUser);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.authValidations.refreshTokenValidationSchema), auth_controller_1.AuthControllers.refreshToken);
router.post('/change-password', (0, auth_1.default)(user_constant_1.USER_ROLE.customer, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.provider, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(auth_validation_1.authValidations.changePasswordValidationSchema), auth_controller_1.AuthControllers.changePassword);
exports.default = router;
