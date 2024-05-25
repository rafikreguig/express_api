const errorHndler = (err, req, res, next) => {
  res.status(500).send({
    error: err.message,
  });
};

export default errorHndler;
