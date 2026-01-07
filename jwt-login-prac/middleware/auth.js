import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  let token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
}


