"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const menuName_controller_1 = require("./menuName.controller");
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const menuName_validation_1 = require("./menuName.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(menuName_controller_1.MenuNameControllers.getAllMenuName)
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.provider, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(menuName_validation_1.MenuNameSchemaValidation.createMenuNameSchemaValidation), menuName_controller_1.MenuNameControllers.createMenuName);
router
    .route('/:id')
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.provider, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(menuName_validation_1.MenuNameSchemaValidation.updateMenuNameSchemaValidation), menuName_controller_1.MenuNameControllers.deleteMenuName)
    .patch((0, auth_1.default)(user_constant_1.USER_ROLE.provider, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), menuName_controller_1.MenuNameControllers.deleteMenuName);
exports.default = router;
