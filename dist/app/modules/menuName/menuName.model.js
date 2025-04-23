"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const menuNameSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    menuImg: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// TO INSERT ISDELETED PROPERTY
// menuNameSchema.pre('findOne', function (next) {
//   this.where('isDeleted', false);
//   next();
// });
const MenuName = (0, mongoose_1.model)('MenuName', menuNameSchema);
exports.default = MenuName;
