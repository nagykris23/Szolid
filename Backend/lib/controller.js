"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchDataById = exports.putDataById = exports.deleteDataById = exports.postData = exports.getDataById = exports.getAllData = exports.run = void 0;
var model_1 = require("./model");
var run = function (_req, res) {
    res.json({ status: "ok", message: "Az API fut" });
};
exports.run = run;
var getAllData = function (req, res) {
    var category = String(req.query.category || "").toLowerCase();
    if (!category) {
        return res.json(model_1.products);
    }
    var filtered = model_1.products.filter(function (p) { return p.category.toLowerCase() === category; });
    res.json(filtered);
};
exports.getAllData = getAllData;
var getDataById = function (req, res) {
    var id = Number(req.params.id);
    var item = model_1.products.find(function (p) { return p.id === id; });
    if (!item) {
        return res.status(404).json({ message: "Termék nem található" });
    }
    res.json(item);
};
exports.getDataById = getDataById;
var postData = function (req, res) {
    var _a;
    var _b = (_a = req.body) !== null && _a !== void 0 ? _a : {}, name = _b.name, description = _b.description, price = _b.price, category = _b.category;
    if (!name || !description || typeof price !== "number" || !category) {
        return res.status(400).json({
            message: "Rosszul megadott adat",
        });
    }
    var newId = model_1.products.length ? Math.max.apply(Math, __spreadArray([], __read(model_1.products.map(function (p) { return p.id; })), false)) + 1 : 1;
    var newProduct = {
        id: newId,
        name: name,
        description: description,
        price: price,
        category: category,
    };
    model_1.products.push(newProduct);
    res.status(201).json(newProduct);
};
exports.postData = postData;
var deleteDataById = function (req, res) {
    var id = Number(req.params.id);
    var index = model_1.products.findIndex(function (p) { return p.id === id; });
    if (index === -1) {
        return res.status(404).json({ message: "Termék nem található" });
    }
    var deleted = model_1.products[index];
    model_1.products.splice(index, 1);
    res.json({ message: "Deleted", deleted: deleted });
};
exports.deleteDataById = deleteDataById;
var putDataById = function (req, res) {
    var _a;
    var id = Number(req.params.id);
    var index = model_1.products.findIndex(function (p) { return p.id === id; });
    if (index === -1) {
        return res.status(404).json({ message: "Termék nem található" });
    }
    var _b = (_a = req.body) !== null && _a !== void 0 ? _a : {}, name = _b.name, description = _b.description, price = _b.price, category = _b.category;
    if (!name || !description || typeof price !== "number" || !category) {
        return res.status(400).json({
            message: "Rosszul megadott adatok",
        });
    }
    var updated = { id: id, name: name, description: description, price: price, category: category };
    model_1.products[index] = updated;
    res.json(updated);
};
exports.putDataById = putDataById;
var patchDataById = function (req, res) {
    var _a;
    var id = Number(req.params.id);
    var item = model_1.products.find(function (p) { return p.id === id; });
    if (!item) {
        return res.status(404).json({ message: "Termék nem található" });
    }
    var _b = (_a = req.body) !== null && _a !== void 0 ? _a : {}, name = _b.name, description = _b.description, price = _b.price, category = _b.category;
    if (price !== undefined && typeof price !== "number") {
        return res.status(400).json({ message: "Az árnak egy számnak kell lennie" });
    }
    if (name !== undefined)
        item.name = name;
    if (description !== undefined)
        item.description = description;
    if (price !== undefined)
        item.price = price;
    if (category !== undefined)
        item.category = category;
    res.json(item);
};
exports.patchDataById = patchDataById;
