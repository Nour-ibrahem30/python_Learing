import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return res.status(400).json({
      status: 'fail',
      message: 'بيانات غلط',
      errors: messages,
    });
  }
  
  next();
};
