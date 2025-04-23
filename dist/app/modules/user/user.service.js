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
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_constant_1 = require("./user.constant");
const customer_model_1 = __importDefault(require("../customer/customer.model"));
const auth_utils_1 = __importDefault(require("../auth/auth.utils"));
const config_1 = __importDefault(require("../../config"));
const provider_model_1 = __importDefault(require("../provider/provider.model"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const createCustomerInDB = (file, password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {};
    const randomPass = Math.ceil(Math.random() * 1000000).toString();
    userData.password = password || randomPass;
    userData.email = payload.email;
    userData.method = payload.method;
    userData.phoneNumber = payload.phoneNumber || '';
    userData.role = user_constant_1.USER_ROLE.customer;
    userData.name = payload.name;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    console.log(userData);
    try {
        // CREATING USER
        const newUser = yield user_model_1.User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError_1.default(400, 'Failed to create user!');
        }
        payload.profileImg = payload.profileImg || (file === null || file === void 0 ? void 0 : file.path) || '';
        payload.user = newUser[0]._id;
        // CREATING CUSTOMER
        const newCustomer = yield customer_model_1.default.create([payload], { session });
        if (!newCustomer.length) {
            throw new AppError_1.default(400, 'Failed to create customer!');
        }
        yield session.commitTransaction();
        yield session.endSession();
        const jwtPayload = {
            email: newUser[0].email,
            role: newUser[0].role,
            id: newUser[0]._id,
            profileImg: newCustomer[0].profileImg,
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
const createAdminInDB = (file, password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {};
    userData.password = password;
    userData.email = payload.email;
    userData.method = payload.method;
    userData.phoneNumber = payload.phoneNumber;
    userData.role = user_constant_1.USER_ROLE.admin;
    userData.name = payload.name;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        payload.profileImg = payload.profileImg || (file === null || file === void 0 ? void 0 : file.path) || '';
        // CREATING USER
        const newUser = yield user_model_1.User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError_1.default(400, 'Failed to create user!');
        }
        payload.user = newUser[0]._id;
        // CREATING CUSTOMER
        const newAdmin = yield admin_model_1.default.create([payload], { session });
        if (!newAdmin.length) {
            throw new AppError_1.default(400, 'Failed to create admin!');
        }
        yield session.commitTransaction();
        yield session.endSession();
        const jwtPayload = {
            email: newUser[0].email,
            role: newUser[0].role,
            id: newUser[0]._id,
            profileImg: newAdmin[0].profileImg,
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
const createProviderInDB = (file, password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {};
    userData.password = password;
    userData.email = payload.email;
    userData.method = payload.method;
    userData.phoneNumber = payload.phoneNumber;
    userData.role = user_constant_1.USER_ROLE.provider;
    userData.name = payload.name;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        payload.profileImg = payload.profileImg || (file === null || file === void 0 ? void 0 : file.path) || '';
        // CREATING USER
        const newUser = yield user_model_1.User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError_1.default(400, 'Failed to create user!');
        }
        payload.user = newUser[0]._id;
        // CREATING PROVIDER
        const newProvider = yield provider_model_1.default.create([payload], { session });
        if (!newProvider.length) {
            throw new AppError_1.default(400, 'Failed to create meal provider!');
        }
        yield session.commitTransaction();
        yield session.endSession();
        const jwtPayload = {
            email: newUser[0].email,
            role: newUser[0].role,
            id: newUser[0]._id,
            profileImg: newProvider[0].profileImg,
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
const getMe = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === user_constant_1.USER_ROLE.customer) {
        result = yield customer_model_1.default.findOne({ user: userId }).populate('user');
    }
    if (role === user_constant_1.USER_ROLE.provider) {
        result = yield provider_model_1.default.findOne({ user: userId }).populate('user');
    }
    if (role === user_constant_1.USER_ROLE.admin) {
        result = yield admin_model_1.default.findOne({ user: userId }).populate('user');
    }
    return result;
});
const changeStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
exports.UserServices = {
    createCustomerInDB,
    createAdminInDB,
    createProviderInDB,
    getMe,
    changeStatus,
};
