import createHttpError from "http-errors";
import validator from "validator";
import UserModel from "../userModel.js";
import bcrypt from "bcrypt";
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;
export const createUser = async (userData) => {
  const { name, email, picture, status, password } = userData;
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all fields");
  }
  //check name length
  if (
    !(validator.isLength(name),
    {
      min: 2,
      max: 16,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please enter a name length between 6 and 16 caharacters"
    );
  }
  if (status && status.length > 64) {
    throw createHttpError.BadRequest(
      "Please enter a status less than 64 caharacters"
    );
  }
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest("Please enter avalid email");
  }

  //check if user already exists
  const checkDb = await UserModel.findOne({ email });
  if (checkDb) {
    throw createHttpError.Conflict("This email is already taken");
  }

  //check password length
  if (!validator.isLength(password, { min: 6, max: 128 })) {
    throw createHttpError.BadRequest(
      "Please make sure that your password is between 6 and 128 characters "
    );
  }

  //hash password ----to be done at the user model

  // adding the user to  the database
  const user = await new UserModel({
    name,
    email,
    picture: picture || DEFAULT_PICTURE,
    status: status || DEFAULT_STATUS,
    password,
  }).save();
  return user;
};
export const signUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
  if (!user) {
    throw createHttpError.NotFound("Invalid Credentials");
  }
  //compare password

  let passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) throw createHttpError.NotFound("Invalid Credentails");
  return user;
};
