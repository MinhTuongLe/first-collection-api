const User = require("../models/user");
const { Roles } = require("../consts/role");
const { Statuses } = require("../consts/status");
const jwt = require("jsonwebtoken");
const { sendVerificationMail } = require("./emailService");
const crypto = require("crypto");
const {
  saveRefreshToken,
  generateRefreshToken,
} = require("./refreshTokenService");
const { JWT_SECRET, BASE_URL } = require("../config/config");

// Register a new user
const registerUser = async (email, password) => {
  try {
    const user = new User({ email, password });
    await user.save();
    const secretCode = crypto.randomBytes(64).toString("hex");

    const token = jwt.sign(
      { email, secretCode },
      JWT_SECRET,
      { expiresIn: "24h" } // Thời gian hết hạn
    );

    const verificationLink = `${BASE_URL}/api/v1/auth/verify?token=${token}`;

    const resSendMail = await sendVerificationMail({
      to: email,
      subject: `Greetings, ${email.split("@")[0]}`,
      verificationLink,
    });
    return {
      message: `User registered successfully. ${
        resSendMail
          ? "Check your email to verify account."
          : "Send verify email failed."
      }`,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

// Login a user
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email not found");
    }

    if (user.status !== Statuses.ACTIVE) {
      throw new Error("User is inactive");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error("Wrong password");
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Generate Refresh Token
    const refreshToken = await generateRefreshToken(); // Function to generate refresh token
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours

    // Save Refresh Token
    await saveRefreshToken(user._id, refreshToken, expiresAt);

    return { accessToken };
  } catch (err) {
    throw new Error(err.message);
  }
};

// GET all users
const getAllUsers = async (query) => {
  const { page = 1, limit = 10, search = "" } = query;

  let queryObj = {};
  if (search) {
    queryObj.name = { $regex: search, $options: "i" };
  }

  try {
    const users = await User.find(queryObj)
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
      .limit(limit * 1) // Convert limit to number and apply
      .skip((page - 1) * limit) // Calculate the number of documents to skip
      .exec();

    const count = await User.countDocuments(queryObj);

    return {
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

// GET one user by id
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// GET one user by email
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// UPDATE user
const updateUser = async (id, userData, currentUserId) => {
  if (id !== currentUserId.toString()) {
    throw new Error("You can only update your own information");
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Cannot find user");
    }

    if (userData.email) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser && existingUser._id.toString() !== id) {
        throw new Error("This email already used");
      }
    }

    Object.keys(userData).forEach((key) => {
      if (userData[key] != null) {
        user[key] = userData[key];
      }
    });

    const updatedUser = await user.save();
    return updatedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

// UPDATE user role
const updateUserRole = async (id, role) => {
  if (!role || !Object.values(Roles).includes(role)) {
    throw new Error("Invalid role");
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    user.role = role;
    const updatedUser = await user.save();
    return updatedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

// UPDATE user status
const updateUserStatus = async (id, status) => {
  if (!Object.values(Statuses).includes(status)) {
    throw new Error("Invalid status");
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    user.status = status;
    const updatedUser = await user.save();
    return updatedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

// DELETE user
const deleteUser = async (id) => {
  try {
    const result = await User.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error("User not found");
    }
    return { message: "Deleted User" };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
};
