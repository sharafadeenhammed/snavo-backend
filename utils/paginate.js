

const paginate = async (Model, req, appFilter = {}) => {
  const { page = 1, limit = 15, filter={} } = req.query;
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = Number(page) * Number(limit);
  const filterBy = req.query || {};
  delete filterBy.page;
  delete filterBy.limit;
  delete filterBy.sort;
  delete filterBy.sortBy;
  delete filterBy.filter;
  let query = Model.find({ ...filterBy, ...appFilter })
  query.limit(Number(limit));
  query.skip(startIndex);
  if (req.query.sort === "desc" && req.query.sortBy) {
    query = query.sort({ [req.query.sortBy]: -1 });
  }
  else if (req.query.sort === "asc" && req.query.sortBy) {
    query = query.sort({ [req.query.sortBy]: 1 });
  }
  else if(req.query.sortBy && !req.query.sort){
    query = query.sort({ [req.query.sortBy]: -1 });
  }
  else {
    query = query.sort({ createdAt: -1 });
  }
  const data = await query.exec();

  const totalCount = await Model.countDocuments();
  return {
    data,
    count: data.length,
    next: endIndex < totalCount ? { page: Number(page) + 1, limit } : null,
    prev: startIndex > 0 ? { page: Number(page) - 1, limit } : null,
    perPage: limit,
    showing: endIndex < totalCount ? `showing ${startIndex + 1} - ${endIndex} of ${totalCount}` : `showing all of ${totalCount}`
  }
}

module.exports = paginate;




