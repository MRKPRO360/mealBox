"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_validation_1 = require("./review.validation");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router
    .route('/elegibility')
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.customer), review_controller_1.ReviewControllers.checkReviewEleigibility);
router
    .route('/')
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.customer), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.createReviewValidationSchema), review_controller_1.ReviewControllers.createReview);
router
    .route('/:id')
    .patch((0, auth_1.default)(user_constant_1.USER_ROLE.customer), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.updateReviewValidationSchema), review_controller_1.ReviewControllers.updateReview)
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.customer), review_controller_1.ReviewControllers.deleteSingleReview);
router.get('/providers', review_controller_1.ReviewControllers.getAllProviderReviews);
router.get('/recipes', review_controller_1.ReviewControllers.getAllRecipeReviews);
exports.default = router;
