"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_controller_1 = __importDefault(require("../controllers/api.controller"));
const router = (0, express_1.Router)();
// 根據 devBackendPhase5.md Phase 5.3
router.get('/question-types', api_controller_1.default.getQuestionTypes);
router.post('/start-test', api_controller_1.default.startTest);
router.post('/submit-answer', api_controller_1.default.submitAnswer);
router.get('/history', api_controller_1.default.getHistory);
exports.default = router;
//# sourceMappingURL=api.routes.js.map