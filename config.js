const env = process.env.NODE_ENV || 'development';
const credentials = require(`./.credentials.${env}`)

console.table(credentials)

module.exports = credentials