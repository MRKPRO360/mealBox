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
// review.model.ts
const mongoose_1 = require("mongoose");
const recipe_model_1 = __importDefault(require("../recipe/recipe.model"));
const provider_model_1 = __importDefault(require("../provider/provider.model"));
const reviewSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['recipe', 'provider'], required: true },
    targetId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
}, { timestamps: true });
reviewSchema.statics.calcAvgRatings = function (targetId, targetType) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const stats = yield this.aggregate([
            // match
            {
                $match: {
                    targetId,
                    targetType,
                },
            },
            // group
            {
                $group: {
                    _id: '$targetId',
                    nRating: { $sum: 1 },
                    avgRating: { $avg: '$rating' },
                },
            },
        ]);
        const rating = ((_b = (_a = stats[0]) === null || _a === void 0 ? void 0 : _a.avgRating) === null || _b === void 0 ? void 0 : _b.toFixed(1)) || '3';
        const count = ((_c = stats[0]) === null || _c === void 0 ? void 0 : _c.nRating) || 0;
        if (stats.length > 0) {
            if (targetType === 'recipe') {
                yield recipe_model_1.default.findByIdAndUpdate(targetId, {
                    rating: rating,
                    ratingsCount: count,
                });
            }
            else {
                yield provider_model_1.default.findByIdAndUpdate(targetId, {
                    rating: rating,
                    ratingsCount: count,
                });
            }
        }
        else {
            if (targetType === 'recipe') {
                yield recipe_model_1.default.findByIdAndUpdate(targetId, {
                    rating: '3', // default rating fallback
                    ratingsCount: 0,
                });
            }
            else {
                yield provider_model_1.default.findByIdAndUpdate(targetId, {
                    rating: '3', // default rating fallback
                    ratingsCount: 0,
                });
            }
        }
    });
};
// TRIGGERING CALCAVG RATINGS AFTER SAVE
reviewSchema.post('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.constructor.calcAvgRatings(this.targetId, this.targetType);
    });
});
// TRIGGERING CALCAVG RATINGS AFTER UPDATE AND DELETE
reviewSchema.post('findOneAndUpdate', function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!doc)
            return next;
        yield Review.calcAvgRatings(doc.targetId, doc.targetType);
    });
});
reviewSchema.post('findOneAndDelete', function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!doc)
            return next;
        yield Review.calcAvgRatings(doc.targetId, doc.targetType);
    });
});
// ONE REVIEW PER PERSON PER ITEM
reviewSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });
const Review = (0, mongoose_1.model)('Review', reviewSchema);
exports.default = Review;
