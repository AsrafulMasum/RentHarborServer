// const logger = require("../utils/logger");
import logger from "../utils/logger.js";

const logRequests = (req, res, next) => {
  logger.info(
    `${req.method} ${req.originalUrl} - Body: ${JSON.stringify(req.body)}`
  );

  // Capture response status after response is sent
  const originalSend = res.send;
  res.send = function (body) {
    logger.info(
      `Response ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`
    );
    originalSend.call(this, body);
  };

  next();
};

// export default logRequests;
export default logRequests;
