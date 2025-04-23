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
exports.RecipeServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const recipe_constant_1 = require("./recipe.constant");
const recipe_model_1 = __importDefault(require("./recipe.model"));
const provider_model_1 = __importDefault(require("../provider/provider.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
// CREATING A RECIPE
const createRecipeInDB = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = yield provider_model_1.default.findOne({ user: payload === null || payload === void 0 ? void 0 : payload.providerId });
    if (!provider)
        throw new AppError_1.default(400, 'No provider found is that id!');
    return yield recipe_model_1.default.create(Object.assign(Object.assign({}, payload), { providerId: provider._id, recipeImage: (file === null || file === void 0 ? void 0 : file.path) || '' }));
});
// GETTING A RECIPE
const getSingleRecipeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield recipe_model_1.default.findById(id)
        .populate('providerId recipeMenuName')
        .populate({
        path: 'reviews',
        select: 'rating comment userId createdAt',
        populate: {
            path: 'userId',
            select: 'name email',
            populate: {
                path: 'customer',
                select: 'profileImg',
            },
        },
    })
        .lean();
});
// GETTING ALL RECIPES
const getAllRecipesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const recipeQuery = new QueryBuilder_1.default(recipe_model_1.default.find()
        .populate('recipeMenuName')
        .populate({
        path: 'reviews',
        select: 'rating comment userId createdAt',
        populate: {
            path: 'userId',
            select: 'name email',
            populate: {
                path: 'customer',
                select: 'profileImg',
            },
        },
    })
        .lean(), query)
        .search(recipe_constant_1.recipeSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield recipeQuery.countTotal();
    const result = yield recipeQuery.modelQuery;
    return {
        meta,
        result,
    };
});
// GETTING ALL RECIPES NAME AND ID
const getAllRecipesNameAndIdFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield recipe_model_1.default.find().select('recipeName _id');
});
// GETTING RECIPES BY PROVIDER
const getAllMyRecipesFromDB = (query, user) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = yield provider_model_1.default.findOne({ user: user.id });
    if (!provider)
        throw new AppError_1.default(400, 'No provider found is that id!');
    const recipeQuery = new QueryBuilder_1.default(recipe_model_1.default.find({ providerId: provider._id }).populate('recipeMenuName').lean(), query)
        .search(recipe_constant_1.recipeSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield recipeQuery.countTotal();
    const result = yield recipeQuery.modelQuery;
    return {
        meta,
        result,
    };
});
// UPDATING A RECIPE
const updateRecipeInDB = (id, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    // ARR of OBJ
    // ingredients, instructions,
    // ARR
    // tags, allergens, utensils
    return yield recipe_model_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, payload), { recipeImage: (file === null || file === void 0 ? void 0 : file.path) || payload.recipeImage }), { new: true });
});
// DELETING A RECIPE
const deleteRecipeInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield recipe_model_1.default.findByIdAndUpdate(id, {
        isDeleted: true,
    });
});
exports.RecipeServices = {
    createRecipeInDB,
    getSingleRecipeFromDB,
    getAllRecipesFromDB,
    updateRecipeInDB,
    deleteRecipeInDB,
    getAllRecipesNameAndIdFromDB,
    getAllMyRecipesFromDB,
};
