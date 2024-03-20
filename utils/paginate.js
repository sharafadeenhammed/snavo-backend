

const paginate = async (Model, req) => {
  const { page = 1, limit = 15 } = req.query;
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = Number(page) * Number(limit);
  const data = await Model.find().limit(Number(limit)).skip(startIndex);
  const totalCount = await Model.countDocuments();
  return {
    data,
    next: endIndex < totalCount ? { page: Number(page) + 1, limit } : null,
    prev: startIndex > 0 ? { page: Number(page) - 1, limit } : null,
    perPage: limit,
    showing: endIndex < totalCount ? `showing ${startIndex + 1} - ${endIndex} of ${totalCount}` : `showing  all of ${totalCount}`
  }
}

module.exports = paginate;




