export const notFound = (req, res, next) => {
  const error = new Error("API route not found");
  res.status(404);
  next(error);
};
