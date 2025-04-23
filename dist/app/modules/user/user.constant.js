"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.METHOD = exports.USER_ROLE = void 0;
exports.USER_ROLE = {
    superAdmin: 'superAdmin',
    customer: 'customer',
    provider: 'provider',
    admin: 'admin',
};
exports.METHOD = {
    credentials: 'credentials',
    github: 'github',
    google: 'google',
};
exports.UserStatus = ['in-progress', 'blocked'];
