module.exports = async (req, res) => {
  return res.status(404).send({ error: '404', message: 'Page not found' });
};
