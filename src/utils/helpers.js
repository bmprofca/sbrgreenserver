function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function ok(res, data, message = "OK") {
  return res.json({ success: true, message, data });
}

function fail(res, status, message) {
  return res.status(status).json({ success: false, message });
}

module.exports = { asyncHandler, ok, fail };
