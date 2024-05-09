function Authenticated(req, res, next) {
  if (!req.query.apiKey) {
    return res
      .status(403)
      .json({ statusCode: 401, message: "Missing API Key!!" });
  }
  if (req.query.apiKey !== process.env.API_KEY) {
    return res
      .status(403)
      .json({ statusCode: 401, message: "Invalid API Key!" });
  }
  next();
}
export default Authenticated;
