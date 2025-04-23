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
exports.RecipeControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const recipe_service_1 = require("./recipe.service");
const createRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recipe_service_1.RecipeServices.createRecipeInDB(req.file, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Recipe created successfully',
        data: result,
    });
}));
const getSingleRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield recipe_service_1.RecipeServices.getSingleRecipeFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Recipe retrieved successfully',
        data: result,
    });
}));
const getAllRecipes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recipe_service_1.RecipeServices.getAllRecipesFromDB(req === null || req === void 0 ? void 0 : req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Recipes retrieved successfully',
        data: result,
    });
}));
const getAllMyRecipes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recipe_service_1.RecipeServices.getAllMyRecipesFromDB(req === null || req === void 0 ? void 0 : req.query, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Recipes retrieved successfully',
        data: result,
    });
}));
const getAllRecipesNameAndId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recipe_service_1.RecipeServices.getAllRecipesNameAndIdFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Recipes name and id retrieved successfully',
        data: result,
    });
}));
const updateSingleRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield recipe_service_1.RecipeServices.updateRecipeInDB(id, req === null || req === void 0 ? void 0 : req.body, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Recipe updated successfully',
        data: result,
    });
}));
const deleteRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield recipe_service_1.RecipeServices.deleteRecipeInDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Recipes deleted successfully',
        data: result,
    });
}));
exports.RecipeControllers = {
    createRecipe,
    getSingleRecipe,
    getAllRecipes,
    getAllMyRecipes,
    getAllRecipesNameAndId,
    updateSingleRecipe,
    deleteRecipe,
};
