// src/index.ts
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

// node_modules/@deepseek-ai/cosmokit/lib/index.js
function isNullable(value) {
  return value === null || value === void 0;
}
function isPlainObject(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}
function filterKeys(object, filter) {
  return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
}
function mapValues(object, transform) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
}
function pick(source, keys, forced) {
  if (!keys) return { ...source };
  const result = {};
  for (const key of keys) if (forced || source[key] !== void 0) result[key] = source[key];
  return result;
}
function is(type, value) {
  if (arguments.length === 1) return (value2) => is(type, value2);
  return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
function isArrayBufferLike(value) {
  return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
}
function isArrayBufferSource(value) {
  return isArrayBufferLike(value) || ArrayBuffer.isView(value);
}
var Binary;
(function(Binary2) {
  Binary2.is = isArrayBufferLike;
  Binary2.isSource = isArrayBufferSource;
  function fromSource(source) {
    if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
    else return source;
  }
  Binary2.fromSource = fromSource;
  function toBase64(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
    let binary = "";
    const bytes = new Uint8Array(source);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  Binary2.toBase64 = toBase64;
  function fromBase64(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
    return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
  }
  Binary2.fromBase64 = fromBase64;
  function toHex(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
    return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  Binary2.toHex = toHex;
  function fromHex(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
    const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
    const buffer = [];
    for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
    return Uint8Array.from(buffer).buffer;
  }
  Binary2.fromHex = fromHex;
})(Binary || (Binary = {}));
var base64ToArrayBuffer = Binary.fromBase64;
var arrayBufferToBase64 = Binary.toBase64;
var hexToArrayBuffer = Binary.fromHex;
var arrayBufferToHex = Binary.toHex;
function clone(source, refs = /* @__PURE__ */ new Map()) {
  if (!source || typeof source !== "object") return source;
  if (is("Date", source)) return new Date(source.valueOf());
  if (is("RegExp", source)) return new RegExp(source.source, source.flags);
  if (isArrayBufferLike(source)) return source.slice(0);
  if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  const cached = refs.get(source);
  if (cached) return cached;
  if (Array.isArray(source)) {
    const result2 = [];
    refs.set(source, result2);
    source.forEach((value, index) => {
      result2[index] = Reflect.apply(clone, null, [value, refs]);
    });
    return result2;
  }
  const result = Object.create(Object.getPrototypeOf(source));
  refs.set(source, result);
  for (const key of Reflect.ownKeys(source)) {
    const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
    if ("value" in descriptor) descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
    Reflect.defineProperty(result, key, descriptor);
  }
  return result;
}
function deepEqual(a, b, strict) {
  if (a === b) return true;
  if (!strict && isNullable(a) && isNullable(b)) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (!a || !b) return false;
  function check(test, then) {
    return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
  }
  return check(Array.isArray, (a2, b2) => a2.length === b2.length && a2.every((item, index) => deepEqual(item, b2[index]))) ?? check(is("Date"), (a2, b2) => a2.valueOf() === b2.valueOf()) ?? check(is("RegExp"), (a2, b2) => a2.source === b2.source && a2.flags === b2.flags) ?? check(isArrayBufferLike, (a2, b2) => {
    if (a2.byteLength !== b2.byteLength) return false;
    const viewA = new Uint8Array(a2);
    const viewB = new Uint8Array(b2);
    for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
    return true;
  }) ?? Object.keys({
    ...a,
    ...b
  }).every((key) => deepEqual(a[key], b[key], strict));
}
var Time;
(function(Time2) {
  Time2.millisecond = 1;
  Time2.second = 1e3;
  Time2.minute = Time2.second * 60;
  Time2.hour = Time2.minute * 60;
  Time2.day = Time2.hour * 24;
  Time2.week = Time2.day * 7;
  let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
  function setTimezoneOffset(offset) {
    timezoneOffset = offset;
  }
  Time2.setTimezoneOffset = setTimezoneOffset;
  function getTimezoneOffset() {
    return timezoneOffset;
  }
  Time2.getTimezoneOffset = getTimezoneOffset;
  function getDateNumber(date2 = /* @__PURE__ */ new Date(), offset) {
    if (typeof date2 === "number") date2 = new Date(date2);
    if (offset === void 0) offset = timezoneOffset;
    return Math.floor((date2.valueOf() / Time2.minute - offset) / 1440);
  }
  Time2.getDateNumber = getDateNumber;
  function fromDateNumber(value, offset) {
    const date2 = new Date(value * Time2.day);
    if (offset === void 0) offset = timezoneOffset;
    return new Date(+date2 + offset * Time2.minute);
  }
  Time2.fromDateNumber = fromDateNumber;
  const numeric = /\d+(?:\.\d+)?/.source;
  const timeRegExp = new RegExp(`^${[
    "w(?:eek(?:s)?)?",
    "d(?:ay(?:s)?)?",
    "h(?:our(?:s)?)?",
    "m(?:in(?:ute)?(?:s)?)?",
    "s(?:ec(?:ond)?(?:s)?)?"
  ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
  function parseTime(source) {
    const capture = timeRegExp.exec(source);
    if (!capture) return 0;
    return (parseFloat(capture[1]) * Time2.week || 0) + (parseFloat(capture[2]) * Time2.day || 0) + (parseFloat(capture[3]) * Time2.hour || 0) + (parseFloat(capture[4]) * Time2.minute || 0) + (parseFloat(capture[5]) * Time2.second || 0);
  }
  Time2.parseTime = parseTime;
  function parseDate(date2) {
    const parsed = parseTime(date2);
    if (parsed) date2 = Date.now() + parsed;
    else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date2)) date2 = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date2}`;
    else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date2)) date2 = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date2}`;
    return date2 ? new Date(date2) : /* @__PURE__ */ new Date();
  }
  Time2.parseDate = parseDate;
  function format(ms) {
    const abs = Math.abs(ms);
    if (abs >= Time2.day - Time2.hour / 2) return Math.round(ms / Time2.day) + "d";
    else if (abs >= Time2.hour - Time2.minute / 2) return Math.round(ms / Time2.hour) + "h";
    else if (abs >= Time2.minute - Time2.second / 2) return Math.round(ms / Time2.minute) + "m";
    else if (abs >= Time2.second) return Math.round(ms / Time2.second) + "s";
    return ms + "ms";
  }
  Time2.format = format;
  function toDigits(source, length = 2) {
    return source.toString().padStart(length, "0");
  }
  Time2.toDigits = toDigits;
  function template(template2, time = /* @__PURE__ */ new Date()) {
    return template2.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
  }
  Time2.template = template;
})(Time || (Time = {}));

// node_modules/@deepseek-ai/schemastery/lib/index.mjs
var kSchema = Symbol.for("schemastery");
var kValidationError = Symbol.for("ValidationError");
globalThis.__schemastery_index__ ??= 0;
globalThis.__schemastery_refs__ = void 0;
var ValidationError = class extends TypeError {
  options;
  name = "ValidationError";
  constructor(message, options) {
    let prefix = "$";
    for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
    else if (typeof segment === "number") prefix += "[" + segment + "]";
    else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
    if (prefix.startsWith(".")) prefix = prefix.slice(1);
    super((prefix === "$" ? "" : `${prefix} `) + message);
    this.options = options;
  }
  static is(error) {
    return !!error?.[kValidationError];
  }
};
Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
var Schema = function(options) {
  const schema = function(data, options2 = {}) {
    return Schema.resolve(data, schema, options2)[0];
  };
  if (options.refs) {
    const refs = mapValues(options.refs, (options2) => new Schema(options2));
    const getRef = (uid) => refs[uid];
    for (const key in refs) {
      const options2 = refs[key];
      options2.sKey = getRef(options2.sKey);
      options2.inner = getRef(options2.inner);
      options2.list = options2.list && options2.list.map(getRef);
      options2.dict = options2.dict && mapValues(options2.dict, getRef);
    }
    return refs[options.uid];
  }
  Object.assign(schema, options);
  if (typeof schema.callback === "string") try {
    schema.callback = new Function("return " + schema.callback)();
  } catch {
  }
  Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
  Object.setPrototypeOf(schema, Schema.prototype);
  schema.meta ||= {};
  schema.toString = schema.toString.bind(schema);
  return schema;
};
Schema.prototype = Object.create(Function.prototype);
Schema.prototype[kSchema] = true;
Object.defineProperty(Schema.prototype, "~standard", { get() {
  return {
    version: 1,
    vendor: "schemastery",
    validate: (value) => {
      try {
        return { value: Schema.resolve(value, this, {})[0] };
      } catch (error) {
        if (ValidationError.is(error)) return { issues: [{
          message: error.message,
          path: error.options.path
        }] };
        throw error;
      }
    }
  };
} });
Schema.ValidationError = ValidationError;
Schema.prototype.toJSON = function toJSON() {
  if (globalThis.__schemastery_refs__) {
    globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
    return this.uid;
  }
  globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
  globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
  const result = {
    uid: this.uid,
    refs: globalThis.__schemastery_refs__
  };
  globalThis.__schemastery_refs__ = void 0;
  return result;
};
Schema.prototype.set = function set(key, value) {
  this.dict[key] = value;
  return this;
};
Schema.prototype.push = function push(value) {
  this.list.push(value);
  return this;
};
function mergeDesc(original, messages) {
  const result = typeof original === "string" ? { "": original } : { ...original };
  for (const locale in messages) {
    const value = messages[locale];
    if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
    else if (typeof value === "string") result[locale] = value;
  }
  return result;
}
function getInner(value) {
  return value?.$value ?? value?.$inner;
}
function extractKeys(data) {
  return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
}
Schema.prototype.i18n = function i18n(messages) {
  const schema = Schema(this);
  const desc = mergeDesc(schema.meta.description, messages);
  if (Object.keys(desc).length) schema.meta.description = desc;
  if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
    return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
  });
  if (schema.list) schema.list = schema.list.map((inner, index) => {
    return inner.i18n(mapValues(messages, (data = {}) => {
      if (Array.isArray(getInner(data))) return getInner(data)[index];
      if (Array.isArray(data)) return data[index];
      return extractKeys(data);
    }));
  });
  if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
    if (getInner(data)) return getInner(data);
    return extractKeys(data);
  }));
  if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
  return schema;
};
Schema.prototype.extra = function extra(key, value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
};
for (const key of [
  "required",
  "disabled",
  "collapse",
  "hidden",
  "loose"
]) Object.assign(Schema.prototype, { [key](value = true) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
Schema.prototype.deprecated = function deprecated() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "deprecated",
    type: "danger"
  });
  return schema;
};
Schema.prototype.experimental = function experimental() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "experimental",
    type: "warning"
  });
  return schema;
};
Schema.prototype.pattern = function pattern(regexp) {
  const schema = Schema(this);
  const pattern2 = pick(regexp, ["source", "flags"]);
  schema.meta = {
    ...schema.meta,
    pattern: pattern2
  };
  return schema;
};
Schema.prototype.simplify = function simplify(value) {
  if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
  if (isNullable(value)) return value;
  if (this.type === "object" || this.type === "dict") {
    const result = {};
    for (const key in value) {
      const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
      if (this.type === "dict" || !isNullable(item)) result[key] = item;
    }
    if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
    return result;
  } else if (this.type === "array" || this.type === "tuple") {
    const result = [];
    value.forEach((value2, index) => {
      const schema = this.type === "array" ? this.inner : this.list[index];
      const item = schema ? schema.simplify(value2) : value2;
      result.push(item);
    });
    return result;
  } else if (this.type === "intersect") {
    const result = {};
    for (const item of this.list) Object.assign(result, item.simplify(value));
    return result;
  } else if (this.type === "union") for (const schema of this.list) try {
    Schema.resolve(value, schema, {});
    return schema.simplify(value);
  } catch {
  }
  return value;
};
Schema.prototype.toString = function toString(inline) {
  return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
};
Schema.prototype.role = function role(role, extra2) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    role,
    extra: extra2
  };
  return schema;
};
for (const key of [
  "default",
  "link",
  "comment",
  "description",
  "max",
  "min",
  "step"
]) Object.assign(Schema.prototype, { [key](value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
var resolvers = {};
Schema.extend = function extend(type, resolve2) {
  resolvers[type] = resolve2;
};
Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
  if (!schema) return [data];
  if (options.ignore?.(data, schema)) return [data];
  if (isNullable(data) && schema.type !== "lazy") {
    if (schema.meta.required) throw new ValidationError(`missing required value`, options);
    let current = schema;
    let fallback = schema.meta.default;
    while (current?.type === "intersect" && isNullable(fallback)) {
      current = current.list[0];
      fallback = current?.meta.default;
    }
    if (isNullable(fallback)) return [data];
    data = clone(fallback);
  }
  const callback = resolvers[schema.type];
  if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
  try {
    return callback(data, schema, options, strict);
  } catch (error) {
    if (!schema.meta.loose) throw error;
    return [schema.meta.default];
  }
};
Schema.from = function from(source) {
  if (isNullable(source)) return Schema.any();
  else if ([
    "string",
    "number",
    "boolean"
  ].includes(typeof source)) return Schema.const(source).required();
  else if (source[kSchema]) return source;
  else if (typeof source === "function") switch (source) {
    case String:
      return Schema.string().required();
    case Number:
      return Schema.number().required();
    case Boolean:
      return Schema.boolean().required();
    case Function:
      return Schema.function().required();
    default:
      return Schema.is(source).required();
  }
  else throw new TypeError(`cannot infer schema from ${source}`);
};
Schema.lazy = function lazy(builder) {
  const toJSON2 = () => {
    if (!schema.inner[kSchema]) {
      schema.inner = schema.builder();
      schema.inner.meta = {
        ...schema.meta,
        ...schema.inner.meta
      };
    }
    return schema.inner.toJSON();
  };
  const schema = new Schema({
    type: "lazy",
    builder,
    inner: { toJSON: toJSON2 }
  });
  return schema;
};
Schema.natural = function natural() {
  return Schema.number().step(1).min(0);
};
Schema.percent = function percent() {
  return Schema.number().step(0.01).min(0).max(1).role("slider");
};
Schema.date = function date() {
  return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
    const date2 = new Date(value);
    if (isNaN(+date2)) throw new ValidationError(`invalid date "${value}"`, options);
    return date2;
  }, true)]);
};
Schema.regExp = function regExp(flag = "") {
  return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
    try {
      return new RegExp(value, flag);
    } catch (e) {
      throw new ValidationError(e.message, options);
    }
  }, true)]);
};
Schema.arrayBuffer = function arrayBuffer(encoding) {
  return Schema.union([
    Schema.is(ArrayBuffer),
    Schema.is(SharedArrayBuffer),
    Schema.transform(Schema.any(), (value, options) => {
      if (Binary.isSource(value)) return Binary.fromSource(value);
      throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
    }, true),
    ...encoding ? [Schema.transform(Schema.string(), (value, options) => {
      try {
        return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
      } catch (e) {
        throw new ValidationError(e.message, options);
      }
    }, true)] : []
  ]);
};
Schema.extend("lazy", (data, schema, options, strict) => {
  if (!schema.inner[kSchema]) {
    schema.inner = schema.builder();
    schema.inner.meta = {
      ...schema.meta,
      ...schema.inner.meta
    };
  }
  return Schema.resolve(data, schema.inner, options, strict);
});
Schema.extend("any", (data) => {
  return [data];
});
Schema.extend("never", (data, _, options) => {
  throw new ValidationError(`expected nullable but got ${data}`, options);
});
Schema.extend("const", (data, { value }, options) => {
  if (deepEqual(data, value)) return [value];
  throw new ValidationError(`expected ${value} but got ${data}`, options);
});
function checkWithinRange(data, meta, description, options, skipMin = false) {
  const { max = Infinity, min = -Infinity } = meta;
  if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
  if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
}
Schema.extend("string", (data, { meta }, options) => {
  if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
  if (meta.pattern) {
    const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
    if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
  }
  checkWithinRange(data.length, meta, "string length", options);
  return [data];
});
function decimalShift(data, digits) {
  const str = data.toString();
  if (str.includes("e")) return data * Math.pow(10, digits);
  const index = str.indexOf(".");
  if (index === -1) return data * Math.pow(10, digits);
  const frac = str.slice(index + 1);
  const integer = str.slice(0, index);
  if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
  return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
}
function isMultipleOf(data, min, step) {
  step = Math.abs(step);
  if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
  const index = step.toString().indexOf(".");
  const digits = step.toString().slice(index + 1).length;
  return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
}
Schema.extend("number", (data, { meta }, options) => {
  if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
  checkWithinRange(data, meta, "number", options);
  const { step } = meta;
  if (step && !isMultipleOf(data, meta.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
  return [data];
});
Schema.extend("boolean", (data, _, options) => {
  if (typeof data === "boolean") return [data];
  throw new ValidationError(`expected boolean but got ${data}`, options);
});
Schema.extend("bitset", (data, { bits, meta }, options) => {
  let value = 0, keys = [];
  if (typeof data === "number") {
    value = data;
    for (const key in bits) if (data & bits[key]) keys.push(key);
  } else if (Array.isArray(data)) {
    keys = data;
    for (const key of keys) {
      if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
      if (key in bits) value |= bits[key];
    }
  } else throw new ValidationError(`expected number or array but got ${data}`, options);
  if (value === meta.default) return [value];
  return [value, keys];
});
Schema.extend("function", (data, _, options) => {
  if (typeof data === "function") return [data];
  throw new ValidationError(`expected function but got ${data}`, options);
});
Schema.extend("is", (data, { constructor }, options) => {
  if (typeof constructor === "function") {
    if (data instanceof constructor) return [data];
    throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
  } else {
    if (isNullable(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
    let prototype = Object.getPrototypeOf(data);
    while (prototype) {
      if (prototype.constructor?.name === constructor) return [data];
      prototype = Object.getPrototypeOf(prototype);
    }
    throw new ValidationError(`expected ${constructor} but got ${data}`, options);
  }
});
function property(data, key, schema, options) {
  try {
    const [value, adapted] = Schema.resolve(data[key], schema, {
      ...options,
      path: [...options.path || [], key]
    });
    if (adapted !== void 0) data[key] = adapted;
    return value;
  } catch (e) {
    if (!options?.autofix) throw e;
    delete data[key];
    return schema.meta.default;
  }
}
Schema.extend("array", (data, { inner, meta }, options) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
  return [data.map((_, index) => property(data, index, inner, options))];
});
Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in data) {
    let rKey;
    try {
      rKey = Schema.resolve(key, sKey, options)[0];
    } catch (error) {
      if (strict) continue;
      throw error;
    }
    result[rKey] = property(data, key, inner, options);
    data[rKey] = data[key];
    if (key !== rKey) delete data[key];
  }
  return [result];
});
Schema.extend("tuple", (data, { list }, options, strict) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  const result = list.map((inner, index) => property(data, index, inner, options));
  if (strict) return [result];
  result.push(...data.slice(list.length));
  return [result];
});
function merge(result, data) {
  for (const key in data) {
    if (key in result) continue;
    result[key] = data[key];
  }
}
Schema.extend("object", (data, { dict }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in dict) {
    const value = property(data, key, dict[key], options);
    if (!isNullable(value) || key in data) result[key] = value;
  }
  if (!strict) merge(result, data);
  return [result];
});
Schema.extend("union", (data, { list, toString: toString2 }, options, strict) => {
  const messages = [];
  for (const inner of list) try {
    return Schema.resolve(data, inner, options, strict);
  } catch (error) {
    messages.push(error);
  }
  throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
});
Schema.extend("intersect", (data, { list, toString: toString2 }, options, strict) => {
  if (!list.length) return [data];
  let result;
  for (const inner of list) {
    const value = Schema.resolve(data, inner, options, true)[0];
    if (isNullable(value)) continue;
    if (isNullable(result)) result = value;
    else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
    else if (typeof value === "object") merge(result ??= {}, value);
    else if (result !== value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
  }
  if (!strict && isPlainObject(data)) merge(result, data);
  return [result];
});
Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
  const [result, adapted = data] = Schema.resolve(data, inner, options, true);
  if (preserve) return [callback(result)];
  else return [callback(result), callback(adapted)];
});
var formatters = {};
function defineMethod(name2, keys, format) {
  formatters[name2] = format;
  Object.assign(Schema, { [name2](...args) {
    const schema = new Schema({ type: name2 });
    keys.forEach((key, index) => {
      switch (key) {
        case "sKey":
          schema.sKey = args[index] ?? Schema.string();
          break;
        case "inner":
          schema.inner = Schema.from(args[index]);
          break;
        case "list":
          schema.list = args[index].map(Schema.from);
          break;
        case "dict":
          schema.dict = mapValues(args[index], Schema.from);
          break;
        case "bits":
          schema.bits = {};
          for (const key2 in args[index]) {
            if (typeof args[index][key2] !== "number") continue;
            schema.bits[key2] = args[index][key2];
          }
          break;
        case "callback": {
          const callback = schema.callback = args[index];
          callback["toJSON"] ||= () => callback.toString();
          break;
        }
        case "constructor": {
          const constructor = schema.constructor = args[index];
          if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
          break;
        }
        default:
          schema[key] = args[index];
      }
    });
    if (name2 === "object" || name2 === "dict") schema.meta.default = {};
    else if (name2 === "array" || name2 === "tuple") schema.meta.default = [];
    else if (name2 === "bitset") schema.meta.default = 0;
    return schema;
  } });
}
defineMethod("is", ["constructor"], ({ constructor }) => {
  if (typeof constructor === "function") return constructor.name;
  else return constructor;
});
defineMethod("any", [], () => "any");
defineMethod("never", [], () => "never");
defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
defineMethod("string", [], () => "string");
defineMethod("number", [], () => "number");
defineMethod("boolean", [], () => "boolean");
defineMethod("bitset", ["bits"], () => "bitset");
defineMethod("function", [], () => "function");
defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
defineMethod("object", ["dict"], ({ dict }) => {
  if (Object.keys(dict).length === 0) return "{}";
  return `{ ${Object.entries(dict).map(([key, inner]) => {
    return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
  }).join(", ")} }`;
});
defineMethod("union", ["list"], ({ list }, inline) => {
  const result = list.map(({ toString: format }) => format()).join(" | ");
  return inline ? `(${result})` : result;
});
defineMethod("intersect", ["list"], ({ list }) => {
  return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
});
defineMethod("transform", [
  "inner",
  "callback",
  "preserve"
], ({ inner }, isInner) => inner.toString(isInner));

// src/store.ts
var LOG = "dsh-models-radar";
var FRESH_BENCHMARKS_MS = 60 * 6e4;
var FRESH_EFFICIENCY_MS = 15 * 6e4;
var FRESH_LEADERBOARD_MS = 15 * 6e4;
var FRESH_HISTORY_MS = 60 * 6e4;
var FRESH_SNAPSHOT_MS = FRESH_EFFICIENCY_MS;
var channelDatasets = (benchmark) => [
  { key: "benchmarks", kind: "benchmarks", windowMs: FRESH_BENCHMARKS_MS },
  { key: `eff:${benchmark}`, kind: "eff", windowMs: FRESH_EFFICIENCY_MS },
  { key: `hist:${benchmark}`, kind: "hist", windowMs: FRESH_HISTORY_MS },
  { key: `lb:${benchmark}`, kind: "lb", windowMs: FRESH_LEADERBOARD_MS }
];
var num = (value) => typeof value === "number" && Number.isFinite(value) ? value : null;
function djb2(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = (hash << 5) + hash + text.charCodeAt(i) >>> 0;
  return hash.toString(36);
}
function createRadarDataStore(upstream, snapshots, clock) {
  const datasets = /* @__PURE__ */ new Map();
  const inflight = /* @__PURE__ */ new Map();
  const lastView = /* @__PURE__ */ new Map();
  const lastHash = /* @__PURE__ */ new Map();
  const commits = /* @__PURE__ */ new Map();
  const resolveDataset = async (key, kind, benchmark, windowMs, bypass) => {
    const now = clock.now();
    const cached = datasets.get(key);
    if (!bypass && cached !== void 0 && now - cached.at < windowMs) {
      return { value: cached.value, at: cached.at, upstream: false };
    }
    const pending = inflight.get(key);
    if (pending !== void 0) return pending;
    const flight = upstream.fetchDataset(kind, benchmark).then((value) => {
      const at = clock.now();
      datasets.set(key, { at, value });
      return { value, at, upstream: true };
    }).finally(() => {
      inflight.delete(key);
    });
    inflight.set(key, flight);
    return flight;
  };
  const assemble = async (benchmark, defaultModel, bypass) => {
    const flights = await Promise.all(
      channelDatasets(benchmark).map(
        (dataset) => resolveDataset(dataset.key, dataset.kind, benchmark, dataset.windowMs, bypass)
      )
    );
    const bench = flights[0].value;
    const eff = flights[1].value;
    const hist = flights[2].value;
    const lb = flights[3].value;
    const channels = (bench.benchmarks ?? []).filter((b) => typeof b.id === "string").map((b) => ({
      id: b.id,
      title: typeof b.title === "string" ? b.title : b.id,
      scoreLabel: typeof b.score_label === "string" ? b.score_label : "",
      isDefault: b.default === true
    }));
    const taskRates = /* @__PURE__ */ new Map();
    for (const model of lb.models ?? []) {
      if (typeof model.model !== "string" || typeof model.effort !== "string") continue;
      const key = `${model.model}@${model.effort}`;
      const rows = Object.entries(model.tasks ?? {}).map(([taskId, task]) => [
        taskId,
        num(task.score_rate) ?? (task.majority_pass === true ? 1 : 0),
        typeof task.majority_pass === "boolean" ? task.majority_pass : void 0
      ]);
      rows.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      taskRates.set(key, rows);
    }
    const tiers = [];
    const series = {};
    for (const point of eff.points ?? []) {
      if (typeof point.model !== "string" || typeof point.effort !== "string") continue;
      const key = `${point.model}@${point.effort}`;
      const total = num(point.total) ?? 0;
      const passed = num(point.passed) ?? 0;
      tiers.push({
        key,
        model: point.model,
        effort: point.effort,
        iq: num(point.iq) ?? 0,
        avgPrice: num(point.average_price_usd),
        avgMinutes: num(point.average_minutes),
        cacheHit: num(point.cache_hit_rate),
        passed,
        total,
        passRate: total > 0 ? passed / total : null,
        runs24h: num(point.runs_24h) ?? 0
      });
      const entries = hist[key] ?? hist[point.model];
      if (Array.isArray(entries) && entries.length > 0) {
        series[key] = entries.filter((e) => typeof e.ts === "string").map((e) => [e.ts, num(e.score) ?? 0]);
      }
    }
    tiers.sort((a, b) => b.iq - a.iq);
    return {
      view: {
        benchmark,
        scoringMode: typeof eff.scoring_mode === "string" ? eff.scoring_mode : void 0,
        scoreLabel: typeof eff.score_label === "string" ? eff.score_label : "",
        fetchedAt: new Date(Math.min(...flights.map((flight) => flight.at))).toISOString(),
        sourceUpdatedAt: typeof eff.source_updated_at === "string" ? eff.source_updated_at : void 0,
        defaultModel,
        channels,
        tiers,
        taskRates: Object.fromEntries(taskRates),
        series
      },
      upstreamHits: flights.reduce((hits, flight) => hits + Number(flight.upstream), 0)
    };
  };
  const commitSnapshot = async (benchmark, view) => {
    const iq = {};
    for (const tier of view.tiers) iq[tier.key] = tier.iq;
    const hash = djb2(JSON.stringify(iq));
    if (lastHash.get(benchmark) === hash) {
      await snapshots.commit(benchmark, view);
      return;
    }
    await snapshots.commit(benchmark, view, JSON.stringify({ ts: view.fetchedAt, b: benchmark, iq }));
    lastHash.set(benchmark, hash);
  };
  const enqueueCommit = async (benchmark, view) => {
    const tail = commits.get(benchmark) ?? Promise.resolve();
    const commit = tail.then(() => commitSnapshot(benchmark, view));
    commits.set(
      benchmark,
      commit.then(
        () => void 0,
        () => void 0
      )
    );
    try {
      await commit;
    } catch (error) {
      console.error(`[${LOG}] snapshot commit failed:`, error);
    }
  };
  const readSnapshotSafe = async (benchmark) => {
    try {
      return await snapshots.read(benchmark);
    } catch {
      return void 0;
    }
  };
  const get = async ({ benchmark, bypass, defaultModel }) => {
    const now = clock.now();
    if (!bypass) {
      const allFresh = channelDatasets(benchmark).every(({ key, windowMs }) => {
        const entry = datasets.get(key);
        return entry !== void 0 && now - entry.at < windowMs;
      });
      const current = lastView.get(benchmark);
      if (allFresh && current !== void 0) {
        return { ok: true, fresh: true, throttled: true, fetchedAt: current.fetchedAt, data: current };
      }
      if (current === void 0) {
        const saved = await readSnapshotSafe(benchmark);
        const savedAt = saved === void 0 ? NaN : Date.parse(saved.fetchedAt);
        if (saved !== void 0 && Number.isFinite(savedAt) && now - savedAt < FRESH_SNAPSHOT_MS) {
          lastView.set(benchmark, saved);
          return { ok: true, fresh: true, throttled: true, fetchedAt: saved.fetchedAt, data: saved };
        }
      } else {
        const currentAt = Date.parse(current.fetchedAt);
        if (Number.isFinite(currentAt) && now - currentAt < FRESH_SNAPSHOT_MS) {
          return { ok: true, fresh: true, throttled: true, fetchedAt: current.fetchedAt, data: current };
        }
      }
    }
    try {
      const { view, upstreamHits } = await assemble(benchmark, defaultModel, bypass);
      lastView.set(benchmark, view);
      await enqueueCommit(benchmark, view);
      return {
        ok: true,
        fresh: true,
        throttled: upstreamHits === 0 || void 0,
        fetchedAt: view.fetchedAt,
        data: view
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[${LOG}] refresh failed (${benchmark}):`, message);
      const last = lastView.get(benchmark) ?? await readSnapshotSafe(benchmark);
      if (last !== void 0) {
        return { ok: true, fresh: false, stale: true, notice: message, fetchedAt: last.fetchedAt, data: last };
      }
      return { ok: false, error: message };
    }
  };
  return { get };
}

// src/index.ts
var name = "dsh-models-radar";
var inject = ["webServer", "settings"];
var UPSTREAM = "https://api.codexradar.com/api/v1";
var ROUTE_PREFIX = "/model-radar";
var FETCH_TIMEOUT_MS = 3e4;
var RADAR_SETTINGS_NAMESPACE = "dsh-models-radar";
var RADAR_SETTINGS_SCHEMA = Schema.object({
  liveVisible: Schema.boolean().default(true)
});
var PREF_BODY_LIMIT_BYTES = 1024;
var UPSTREAM_PATHS = {
  benchmarks: () => "/benchmarks",
  eff: (benchmark) => `/intelligence-efficiency?benchmark=${encodeURIComponent(benchmark)}`,
  hist: (benchmark) => `/iq-history?benchmark=${encodeURIComponent(benchmark)}`,
  lb: (benchmark) => `/leaderboard?benchmark=${encodeURIComponent(benchmark)}`
};
var codexRadarUpstream = () => ({
  async fetchDataset(kind, benchmark) {
    const pathAndQuery = UPSTREAM_PATHS[kind](benchmark);
    const response = await fetch(UPSTREAM + pathAndQuery, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });
    if (!response.ok) throw new Error(`upstream ${pathAndQuery} \u2192 HTTP ${response.status}`);
    return await response.json();
  }
});
function dataDir() {
  const root = process.env.DSH_HOME ?? join(homedir(), ".dsh");
  return join(root, "plugin-data", name);
}
var latestPath = (benchmark) => join(dataDir(), `latest-${benchmark}.json`);
var fileSnapshotStore = () => ({
  async read(benchmark) {
    try {
      return JSON.parse(await readFile(latestPath(benchmark), "utf8"));
    } catch {
      return void 0;
    }
  },
  async commit(benchmark, view, timelineLine) {
    await mkdir(dataDir(), { recursive: true });
    await writeFile(latestPath(benchmark), JSON.stringify(view), "utf8");
    if (timelineLine !== void 0) {
      await appendFile(join(dataDir(), "iq-timeline.jsonl"), `${timelineLine}
`, "utf8");
    }
  }
});
function apply(ctx) {
  const currentDefaultModel = () => {
    const service = ctx.get("agentDefaultModel");
    const pick2 = service?.currentSelection?.();
    if (pick2 === void 0 || typeof pick2.model !== "string" || pick2.model === "") return void 0;
    return {
      provider: typeof pick2.provider === "string" ? pick2.provider : "",
      model: pick2.model,
      reasoningEffort: typeof pick2.reasoningEffort === "string" ? pick2.reasoningEffort : void 0
    };
  };
  const store = createRadarDataStore(codexRadarUpstream(), fileSnapshotStore(), { now: () => Date.now() });
  const respond = (res, status, body) => {
    res.writeHead(status, {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    });
    res.end(JSON.stringify(body));
  };
  async function handleData(url, res) {
    const benchmark = url.searchParams.get("benchmark") ?? "deep-swe";
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(benchmark)) {
      respond(res, 400, { ok: false, error: "bad benchmark id" });
      return;
    }
    const bypass = url.searchParams.get("bypass") === "1";
    const response = await store.get({ benchmark, bypass, defaultModel: currentDefaultModel() });
    respond(res, response.ok ? 200 : 502, response);
  }
  async function readJsonBody(req) {
    const chunks = [];
    let total = 0;
    for await (const chunk of req) {
      total += chunk.length;
      if (total > PREF_BODY_LIMIT_BYTES) throw new Error("body too large");
      chunks.push(chunk);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  }
  const settings = ctx.get("settings");
  if (settings === void 0) throw new Error(`[${name}] settings service unavailable`);
  const prefScope = settings.register(RADAR_SETTINGS_NAMESPACE, RADAR_SETTINGS_SCHEMA, { applies: "live" });
  function handlePrefGet(res) {
    respond(res, 200, { ok: true, liveVisible: prefScope.get().liveVisible });
  }
  async function handlePrefPost(req, res) {
    let payload;
    try {
      payload = await readJsonBody(req);
    } catch {
      respond(res, 400, { ok: false, error: "invalid JSON body" });
      return;
    }
    const value = payload?.liveVisible;
    if (typeof value !== "boolean") {
      respond(res, 400, { ok: false, error: "liveVisible must be a boolean" });
      return;
    }
    try {
      await prefScope.update({ liveVisible: value });
    } catch (cause) {
      respond(res, 500, { ok: false, error: cause instanceof Error ? cause.message : String(cause) });
      return;
    }
    respond(res, 200, { ok: true, liveVisible: prefScope.get().liveVisible });
  }
  ctx.effect(
    () => ctx.webServer.register({
      kind: "prefix",
      path: ROUTE_PREFIX,
      handler: (req, res) => {
        void (async () => {
          try {
            const url = new URL(req.url ?? "/", "http://dsh.local");
            if (url.pathname === `${ROUTE_PREFIX}/api/pref`) {
              if (req.method === "GET") handlePrefGet(res);
              else if (req.method === "POST") await handlePrefPost(req, res);
              else respond(res, 405, { ok: false, error: "method not allowed" });
            } else if (req.method !== "GET") {
              respond(res, 405, { ok: false, error: "method not allowed" });
            } else if (url.pathname === `${ROUTE_PREFIX}/api/data`) {
              await handleData(url, res);
            } else if (url.pathname === `${ROUTE_PREFIX}/api/health`) {
              respond(res, 200, { ok: true });
            } else {
              respond(res, 404, { ok: false, error: "not found" });
            }
          } catch (error) {
            console.error(`[${name}] route handler failed:`, error);
            if (!res.headersSent) respond(res, 500, { ok: false, error: "internal error" });
          }
        })();
      }
    }),
    `${name}: api routes`
  );
}
export {
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
