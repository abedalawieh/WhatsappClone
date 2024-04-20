import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export default async function (req, res, next) {
  if (!req.headers["authorization"])
    return next(createHttpError.Unauthorized());
  const bearertoken = req.headers["authorization"];
  const token = await bearertoken.slice(7);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
    if (error) {
      return next(createHttpError.Unauthorized());
    }
    req.user = payload;
    next();
  });
}
