"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const recipe_validation_1 = require("./recipe.validation");
const recipe_controller_1 = require("./recipe.controller");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.provider), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(recipe_validation_1.RecipeValidationSchema.createRecipeValidationSchema), recipe_controller_1.RecipeControllers.createRecipe)
    .get(recipe_controller_1.RecipeControllers.getAllRecipes);
router.get('/nameId', recipe_controller_1.RecipeControllers.getAllRecipesNameAndId);
router.get('/my-recipes', (0, auth_1.default)(user_constant_1.USER_ROLE.provider), recipe_controller_1.RecipeControllers.getAllMyRecipes);
router
    .route('/:id')
    .patch((0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.provider), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(recipe_validation_1.RecipeValidationSchema.updateRecipeValidationSchema), recipe_controller_1.RecipeControllers.updateSingleRecipe)
    .get(recipe_controller_1.RecipeControllers.getSingleRecipe)
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.provider), recipe_controller_1.RecipeControllers.deleteRecipe);
exports.default = router;
