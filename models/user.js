const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { Roles } = require("../consts/role");
const { Statuses } = require("../consts/status");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.length >= 6 && v.length <= 256;
        },
        message: "Password must be between 6 and 256 characters long",
      },
    },
    name: {
      type: String,
      required: false,
      default: "",
    },
    address: {
      type: String,
      required: false,
      default: "",
    },
    phone: {
      type: String,
      required: false,
      default: "",
      validate: {
        validator: function (v) {
          return (
            v === "" || validator.isMobilePhone(v, "any", { strictMode: false })
          );
        },
        message: "Invalid phone number",
      },
    },
    role: {
      type: Number,
      enum: Object.values(Roles),
      default: Roles.USER,
    },
    status: {
      type: Number,
      enum: Object.values(Statuses),
      default: Statuses.INACTIVE,
    },
    avatar: {
      type: String,
      required: false,
      default: "",
    },
    username: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  },
  { timestamps: true }
);

// Exclude password from JSON and Object output
UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

UserSchema.set("toObject", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
