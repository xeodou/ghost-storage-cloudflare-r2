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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const ghost_storage_base_1 = __importDefault(require("ghost-storage-base"));
class Storage extends ghost_storage_base_1.default {
    constructor(option) {
        super();
        this.s3 = new s3_1.default(option);
        this.bucket = option.bucket;
        this.assetHost = option.assetHost || option.endpoint;
    }
    save(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const fileKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}/${image.name}`;
            return fs.promises.readFile(image.path)
                .then((buffer) => __awaiter(this, void 0, void 0, function* () {
                const params = {
                    ACL: 'public-read',
                    Bucket: this.bucket,
                    Key: fileKey,
                    Body: buffer,
                    ContentType: image.type,
                    CacheControl: `max-age=${1000 * 365 * 24 * 60 * 60}` // 365 days
                };
                yield this.s3.putObject(params).promise();
                return `${this.assetHost}/${fileKey}`;
            }));
        });
    }
    serve() {
        return (req, res, next) => {
            const params = {
                Bucket: this.bucket,
                Key: req.path.replace(/^\//, '')
            };
            return this.s3.getObject(params)
                .createReadStream()
                .on('error', next)
                .pipe(res);
        };
    }
    exists(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.s3.headObject({
                Bucket: this.bucket,
                Key: fileName
            }).promise()
                .then(() => true)
                .catch(() => false);
        });
    }
    delete(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.s3.deleteObject({
                Bucket: this.bucket,
                Key: fileName
            }).promise()
                .then(() => true)
                .catch(() => false);
        });
    }
    read(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.s3.getObject({
                Bucket: this.bucket,
                Key: options.path
            }).promise()
                .then((data) => data.Body);
        });
    }
}
exports.default = Storage;
module.exports = Storage;
//# sourceMappingURL=index.js.map