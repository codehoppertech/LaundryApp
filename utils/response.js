/**
 * Standard success response
 */
const successResponse = (res, code, message, data = null) => {
    return res.status(code).json({
      status: 'success',
      code,
      message,
      data,
      errors: null
    });
  };
  
  /**
   * Standard error response
   */
  const errorResponse = (res, code, message, errors = null) => {
    return res.status(code).json({
      status: 'error',
      code,
      message,
      data: null,
      errors: errors || { description: message }
    });
  };
  
  module.exports = {
    successResponse,
    errorResponse
  };