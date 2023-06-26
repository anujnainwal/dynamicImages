const notFound = async (req, res, next, error) => {
  return res.status(404).json({ error: "Not found" });
};
module.exports = notFound;
