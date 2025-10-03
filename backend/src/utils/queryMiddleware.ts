import type { Request, Response, NextFunction } from "express";

export interface QueryOptions {
  sort?: string;
  fields?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

export class APIFeatures {
  query: any;
  queryString: QueryOptions;

  constructor(query: any, queryString: QueryOptions) {
    this.query = query;
    this.queryString = queryString;
  }

  // Filtering
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering with operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // Default sort by newest first
    }
    return this;
  }

  // Field limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // Exclude version field by default
    }
    return this;
  }

  // Pagination
  paginate() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

// Middleware to add advanced query features
export const advancedQuery = (Model: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Create APIFeatures instance
    const features = new APIFeatures(Model.find(), req.query);

    // Execute query with all features
    const docs = await features.filter().sort().limitFields().paginate().query;

    // Get total count for pagination info
    const total = await Model.countDocuments(features.query.getQuery());

    // Add pagination info to response
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const totalPages = Math.ceil(total / limit);

    (res as any).advancedResults = {
      success: true,
      count: docs.length,
      total,
      pagination: {
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      data: docs,
    };

    next();
  };
};
