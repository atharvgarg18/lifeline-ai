"use strict";
// Shared TypeScript types for LifeLine AI
// Used across Frontend, Backend, and shared utilities
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
// ============================================
// Error Types
// ============================================
class AppError extends Error {
    constructor(code, statusCode, message, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
// ============================================
// Export all types
// ============================================
exports.default = {
// Types are automatically exported above
};
//# sourceMappingURL=index.js.map