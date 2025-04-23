"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewControllers = void 0;
const review_service_1 = require("./review.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const checkReviewEleigibility = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield review_service_1.ReviewServices.checkReviewEleigibilityFromDB(Object.assign({ userId: id }, req.body));
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Elegibility checked!',
        data: result,
    });
}));
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield review_service_1.ReviewServices.createReviewInDB(Object.assign({ userId: id }, req.body));
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Review submitted successfully',
        data: result,
    });
}));
const getAllRecipeReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.ReviewServices.getAllReviewsForRecipesFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All recipes review retrieved successfully',
        data: result,
    });
}));
const getAllProviderReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.ReviewServices.getAllReviewsForProvidersFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All providers review retrieved successfully',
        data: result,
    });
}));
const updateReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield review_service_1.ReviewServices.updateReviewInDB(req.body, id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Review updated successfully!',
        data: result,
    });
}));
const deleteSingleReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield review_service_1.ReviewServices.deleteReviewFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Review deleted successfully!',
        data: result,
    });
}));
exports.ReviewControllers = {
    checkReviewEleigibility,
    createReview,
    getAllRecipeReviews,
    getAllProviderReviews,
    updateReview,
    deleteSingleReview,
};
