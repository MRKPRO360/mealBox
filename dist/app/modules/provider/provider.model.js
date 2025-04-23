"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const user_1 = require("../../interface/user");
const user_model_1 = require("../user/user.model");
const provider_constant_1 = require("./provider.constant");
const providerNameSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required'],
        trim: true,
        maxlength: [20, 'Name can not be more than 20 characters'],
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last Name is required'],
        maxlength: [20, 'Name can not be more than 20 characters'],
    },
});
const providerAddressSchema = new mongoose_1.Schema({
    street: { type: String, required: false }, // explicitly set required to false
    city: { type: String, enum: user_1.DIVISIONS, required: false },
    district: { type: String, enum: user_1.DISTRICTS, required: false },
    zipCode: { type: String, required: false }, // explicitly set required to false
});
const providerSchema = new mongoose_1.Schema({
    name: {
        type: providerNameSchema,
        required: true,
    },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    bio: { type: String, required: true },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'User id is required'],
        unique: true,
        ref: 'User',
    },
    address: {
        type: providerAddressSchema,
    },
    profileImg: String,
    cuisineSpecialties: {
        type: [String],
        enum: provider_constant_1.CUISINE_SPECIALTIES,
        default: ['American', 'Indian'],
    },
    availableMealOptions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Recipe' }],
    rating: { type: Number, default: 3 }, // Range: 1-5 stars.
    ratingsCount: { type: Number, default: 0 },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
//virtual
providerSchema.virtual('fullName').get(function () {
    var _a, _b;
    return ((_a = this === null || this === void 0 ? void 0 : this.name) === null || _a === void 0 ? void 0 : _a.firstName) + ' ' + ((_b = this === null || this === void 0 ? void 0 : this.name) === null || _b === void 0 ? void 0 : _b.lastName);
});
// Query Middleware
providerSchema.pre('find', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.find({ isDeleted: { $ne: true } });
        next();
    });
});
providerSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
//creating a custom static method
providerSchema.statics.isproviderExistsById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_model_1.User.findById(id);
    });
};
// VIRTUAL POPULATE
providerSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'targetId',
    localField: '_id',
    options: {
        match: {
            targetType: 'provider',
        },
    },
});
const Provider = mongoose_1.default.model('Provider', providerSchema);
exports.default = Provider;
