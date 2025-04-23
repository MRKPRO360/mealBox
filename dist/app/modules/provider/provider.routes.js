"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const provider_controller_1 = require("./provider.controller");
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const provider_validation_1 = require("./provider.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(provider_controller_1.ProviderControllers.getAllProviders)
    .patch((0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.provider), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    console.log(req.body);
    next();
}, (0, validateRequest_1.default)(provider_validation_1.ProviderValidationsSchema.updateProviderValidatonSchema), provider_controller_1.ProviderControllers.updateProvider);
router.get('/cuisine-specialties', provider_controller_1.ProviderControllers.getAllCuisineSpecialties);
router
    .route('/:id')
    .get(provider_controller_1.ProviderControllers.getSingleProvider)
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.admin), provider_controller_1.ProviderControllers.deleteProvider);
exports.default = router;
