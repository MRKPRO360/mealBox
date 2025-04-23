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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const provider_model_1 = __importDefault(require("./provider.model"));
const user_constant_1 = require("../user/user.constant");
const auth_utils_1 = __importDefault(require("../auth/auth.utils"));
const config_1 = __importDefault(require("../../config"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const provider_constant_1 = require("./provider.constant");
const getAllProvidersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const providerQuery = new QueryBuilder_1.default(provider_model_1.default.find()
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
        .search(provider_constant_1.providerSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield providerQuery.countTotal();
    const result = yield providerQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleProviderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield provider_model_1.default.findById(id)
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
const deleteProviderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deletedProvider = yield provider_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!deletedProvider) {
            throw new AppError_1.default(400, 'Failed to delete provider!');
        }
        const userId = deletedProvider.user;
        const deletedUser = yield user_model_1.User.findByIdAndUpdate(userId, { isDeleted: true }, {
            new: true,
            session,
        });
        if (!deletedUser) {
            throw new AppError_1.default(400, 'Failed to delete user!');
        }
        yield session.commitTransaction();
        session.endSession();
        return deletedProvider;
    }
    catch (err) {
        console.log(err);
        yield session.abortTransaction();
        session.endSession();
        throw new Error('Failed to delete provider!');
    }
});
const updateProviderInDB = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload._id) {
        throw new AppError_1.default(404, "Provider id isn't provided");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Fetch existing user & customer
        const provider = yield provider_model_1.default.findById(payload._id).session(session);
        const user = yield user_model_1.User.findOne({
            email: provider === null || provider === void 0 ? void 0 : provider.email,
            role: user_constant_1.USER_ROLE.provider,
        }).session(session);
        if (!user || !provider) {
            throw new AppError_1.default(404, 'User or Provider not found');
        }
        // If a new image is uploaded, update profileImg for both User and Customer
        if (file === null || file === void 0 ? void 0 : file.path) {
            payload.profileImg = file.path || '';
        }
        const { _id } = payload, data = __rest(payload, ["_id"]);
        // Update User
        yield user_model_1.User.findByIdAndUpdate(user._id, data, {
            session,
            new: true,
        });
        // Update Customer
        const updatedProvider = yield provider_model_1.default.findByIdAndUpdate(provider._id, data, {
            session,
            new: true,
        });
        yield session.commitTransaction();
        yield session.endSession();
        if (!updatedProvider)
            throw new AppError_1.default(400, 'Provider update failed!');
        const jwtPayload = {
            email: updatedProvider.email,
            role: user_constant_1.USER_ROLE.provider,
            id: user._id,
            profileImg: updatedProvider.profileImg,
        };
        const accessToken = (0, auth_utils_1.default)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
        const refreshToken = (0, auth_utils_1.default)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
        return {
            accessToken,
            refreshToken,
        };
    }
    catch (err) {
        console.log(err);
        yield session.abortTransaction();
        session.endSession();
        throw new Error(err);
    }
});
const getAllCuisineSpecialtiesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return [...provider_constant_1.CUISINE_SPECIALTIES];
});
exports.ProviderServices = {
    getAllCuisineSpecialtiesFromDB,
    getAllProvidersFromDB,
    getSingleProviderFromDB,
    updateProviderInDB,
    deleteProviderFromDB,
};
