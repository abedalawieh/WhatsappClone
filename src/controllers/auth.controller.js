import { createUser } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { generateToken, verifyToken } from "../services/token.service.js";
import { findUser } from "../services/user.service.js";

import { signUser } from "../services/auth.service.js";
import createHttpError from "http-errors";

export const register = async (req, res, next) => {
  try {
    const { name, email, picture, status, password } = req.body;
    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });
    const access_Token = await generateToken(
      {
        userId: newUser._id,
      },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );
    const refresh_Token = await generateToken(
      {
        userId: newUser._id,
      },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );
    res.cookie("refreshToken", refresh_Token, {
      httpOnly: false,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    console.table({ access_Token, refresh_Token });
    res.json({
      message: "register success",
      access_Token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await signUser(email, password);
    const access_Token = await generateToken(
      {
        userId: user._id,
      },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );
    const refresh_Token = await generateToken(
      {
        userId: user._id,
      },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );
    res.cookie("refreshToken", refresh_Token, {
      httpOnly: false,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    console.table({ access_Token, refresh_Token });
    res.json({
      message: "register success",
      access_Token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  try {
    await res.clearCookie("refreshToken", {
      path: "/api/v1/auth/refreshtoken",
    });
    await res.json({
      message: "Logged Out",
    });
  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (req, res, next) => {
  try {
    const refresh_token = await req.cookies.refreshToken;
    if (!refresh_token) throw createHttpError.Unauthorized("Please Login!");
    const check = await verifyToken(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await findUser(check.userId);
    const access_Token = await generateToken(
      {
        userId: user._id,
      },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      access_Token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
