require("dotenv").config({ path: "../.env" });
const pool = require("../db");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const privateKey = process.env.JWT_PRIVATE_KEY;

const prisma = new PrismaClient();

module.exports.registerUser = async (name, email, password) => {
  try {
    const userExists = await prisma.users.findMany({
      where: {
        email: email,
      },
    });

    if (userExists.length > 0) {
      return { error: "failed to register user" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    return { message: "user created successfuly", userId: newUser.id };
  } catch (err) {
    return { message: "error registering user", error: err.message };
  }
};

module.exports.authenticateUser = async (email, password) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return { error: "login failed", message: "wrong credentials " };
    }
    const userId = user.id;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "login failed", message: "wrong credentials" };
    }

    return { userId: userId, message: "user logged in" };
  } catch (err) {
    return { message: "error logging in", error: err.message };
  }
};

module.exports.issueJWT = (userId) => {
  const expiresIn = "1d";

  const payload = {
    sub: userId,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, privateKey, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};
