const getStatusCode = (type) => {
  if (type === 'any.required') return 400;
  if (type === 'number.min' || type === 'string.min') return 422;
};

module.exports = (err, _req, res, _next) => {
  if (err.isJoi) {
    const { type } = err.details[0];
    const statusCode = getStatusCode(type);
    return res.status(statusCode).json({ message: err.details[0].message });
  }

  const statusByErrorCode = {
    notFound: 404,
    alreadyExists: 409,
    UnprocessableEntity: 422,
  };

  const status = statusByErrorCode[err.code] || 500;

  res.status(status).json({ message: err.message });
};
