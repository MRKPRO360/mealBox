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
exports.UserControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const createCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { password } = _a, customerData = __rest(_a, ["password"]);
    const result = yield user_service_1.UserServices.createCustomerInDB(req.file, password, customerData);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Customer created successfully',
        data: result,
    });
}));
const createProvider = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { password } = _a, providerData = __rest(_a, ["password"]);
    const result = yield user_service_1.UserServices.createProviderInDB(req.file, password, providerData);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Provider created successfully',
        data: result,
    });
}));
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { password } = _a, adminData = __rest(_a, ["password"]);
    const result = yield user_service_1.UserServices.createAdminInDB(req.file, password, adminData);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Admin created successfully',
        data: result,
    });
}));
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = req.user;
    const result = yield user_service_1.UserServices.getMe(id, role);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User is retrieved succesfully',
        data: result,
    });
}));
const changeStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield user_service_1.UserServices.changeStatus(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Status is updated succesfully',
        data: result,
    });
}));
exports.UserControllers = {
    createCustomer,
    createProvider,
    createAdmin,
    getMe,
    changeStatus,
};
