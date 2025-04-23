"use strict";
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res, next) => {
    res.status(400).json({
        success: false,
        message: "API Not Found 💥",
        error: "",
    });
};
exports.default = notFound;
