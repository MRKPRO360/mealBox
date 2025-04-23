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
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
/* eslint-disable no-console */
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const user_model_1 = require("../modules/user/user.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        // CHECK IF THE TOKEN IS EXISTS
        if (!token)
            throw new AppError_1.default(403, 'You are not authorized!');
        // CHECK IF THE TOKEN IS VALID
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (err) {
            console.log(err);
            throw new AppError_1.default(401, 'Token is invalid!');
        }
        const { role, id } = decoded;
        //CHECK IF THE USER IS EXISTS
        const user = yield user_model_1.User.isUserExistsById(id);
        if (!user)
            throw new AppError_1.default(404, 'This user does not exists!');
        //CHECK IF THE USER IS BLOCKED
        if (user && user.status === 'blocked')
            throw new AppError_1.default(403, 'You are not authorized!');
        //CHECK IF THE USER IS DELETED
        if (user && user.isDeleted)
            throw new AppError_1.default(403, 'You are not authorized!');
        //CHECK IF THE USER ROLE IS CORRECT
        if (requiredRoles && !requiredRoles.includes(role))
            throw new AppError_1.default(403, 'You are not authorized');
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
