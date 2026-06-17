exports.successResponse = (res, message, data = null) => {
  res.status(200).json({
    success: true,
    message,
    data,
  });
};

exports.errorResponse = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
