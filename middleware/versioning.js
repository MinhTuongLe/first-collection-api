function versioningMiddleware(req, res, next) {
  const versionMatch = req.url.match(/\/api\/(v\d+)\//);
  req.version = versionMatch ? versionMatch[1] : "v1";
  next();
}

module.exports = { versioningMiddleware };
