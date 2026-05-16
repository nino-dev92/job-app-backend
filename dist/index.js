"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ debug: true });
const port = process.env.PORT || 3000;
app.get("/home", (req, res) => {
    res.send("Hello");
});
app.listen(port, () => `App is listening on port ${port}`);
