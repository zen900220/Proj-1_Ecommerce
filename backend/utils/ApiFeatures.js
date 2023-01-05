//Product.find() returns a query as mongoose donest automaticallly resolve queries if a callback isnt passed in the func call.
//so this.query contains the query sent by Product.find().
//We know we can chain more conditions to a query such as Product.find().limit(10).skip(5)...so on
//so first chain is done by search() :
//? this.query = Product.find().find({...keyword}), where Product.find() is the old value of this.query
//next is done by filter():
//? this.query = Product.find().find({...keyword}).find(queryObjCopy)
//finally pagination() does limiting results and skips.
//? this.query = Product.find().find({...keyword}).find(queryObjCopy).limit(resultsPerPage).skip(skip)

class ApiFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  search() {
    const keyword = this.queryObj.keyword
      ? {
          name: {
            $regex: this.queryObj.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    //cant do copy=this.queryObj as it will pass a reference to the actual obj instead of making a copy
    let queryObjCopy = { ...this.queryObj };

    //keyword dealt in search, page in pagination, limit elsewhere
    const keysToBeRemoved = ["keyword", "page", "limit"];

    keysToBeRemoved.forEach((key) => {
      delete queryObjCopy[key];
    });

    //Filter for range based stuff : price,rating
    let queryStr = JSON.stringify(queryObjCopy);
    //stringify obj then replace gt,gte,lt,lte with $gt and so on.
    // /g stands for global. ie it doesnt replace the first but all occurences.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    queryObjCopy = JSON.parse(queryStr);

    this.query = this.query.find(queryObjCopy);
    return this;
  }

  pagination(resultsPerPage) {
    const currentPage = this.queryObj.page || 1;

    const skip = (currentPage - 1) * resultsPerPage;
    this.query = this.query.limit(resultsPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;

/**
 * Product.find({name:{...},price:{...},type:...})
 *
 * keyword={name:{...}}
 * price={price:{...}}
 * type={type:...}
 *
 * {...keyword,...price,...type}
 *
 */
