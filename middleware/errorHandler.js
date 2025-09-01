// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({ 
      error: "Conflict", 
      message: "A record with this unique field already exists" 
    });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({ 
      error: "Not Found", 
      message: "Record not found" 
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Invalid token" 
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Token expired" 
    });
  }

  // Default error
  res.status(err.status || 500).json({ 
    error: "Internal Server Error", 
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({ 
    error: "Not Found", 
    message: "The requested resource was not found" 
  });
};

module.exports = { errorHandler, notFoundHandler };