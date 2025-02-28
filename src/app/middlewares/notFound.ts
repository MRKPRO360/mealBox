/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, RequestHandler, Response } from "express";

const notFound: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(400).json({
    success: false,
    message: "API Not Found 💥",
    error: "",
  });
};

export default notFound;
