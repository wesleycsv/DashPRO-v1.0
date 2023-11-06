module.exports = {
  send: (error, req, res, code = 400) => {
    res.status(code).json({
      error,
    });
  },
};
