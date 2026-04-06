"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (err) => {
    var _a, _b;
    const errorSources = [];
    const issues = (_b = (_a = err.issues) !== null && _a !== void 0 ? _a : err.errors) !== null && _b !== void 0 ? _b : [];
    issues.forEach((issue) => {
        errorSources.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message
        });
    });
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    };
};
exports.handleZodError = handleZodError;
