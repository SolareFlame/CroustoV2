const { join } = require('path');

/**
 * Returns the path relative to the current working directory (= project root).
 */
module.exports.rcwd = (...paths) => join(process.cwd(), ...paths);