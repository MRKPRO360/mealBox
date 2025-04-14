import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    // Filtering
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

    excludeFields.forEach((el) => delete queryObj[el]);

    const inStockValue = queryObj.inStock;
    if (typeof inStockValue === 'string') {
      if (inStockValue.toLowerCase() === 'true') {
        queryObj.inStock = true;
      } else if (inStockValue.toLowerCase() === 'false') {
        queryObj.inStock = false;
      } else {
        delete queryObj.inStock; // Remove invalid boolean values
      }
    }

    // Custom rating filter
    if (queryObj.rating) {
      const min = parseFloat(
        Array.isArray(queryObj.rating)
          ? queryObj.rating[0]
          : queryObj.rating || '0',
      );

      queryObj.rating = { $gte: min, $lt: min + 1 };

      this.modelQuery = this.modelQuery.find({
        ...queryObj,
        rating: { $gte: min, $lt: min + 1 },
      });

      return this;
    }

    // let queryStr = JSON.stringify(queryObj);

    // // ADVANCED FILTERING
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // this.modelQuery = this.modelQuery.find(
    // JSON.parse(queryStr) as FilterQuery<T>,
    // );

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sortBy = this.query?.sort as string;
    const order = (this.query?.order as string)?.toLowerCase();

    if (sortBy) {
      const sortOrder = order === 'desc' ? '-' : '';
      this.modelQuery = this.modelQuery.sort(`${sortOrder}${sortBy}`);
    } else {
      this.modelQuery = this.modelQuery.sort('-createdAt');
    }

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = this?.query?.limit ? Number(this.query.limit) : null;
    const skip = (page - 1) * (limit || 10);

    if (limit) {
      this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    }

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
