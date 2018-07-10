const mongoose = require('mongoose')

mongoose.Promise = global.Promise
// mongoose.connect(process.env.MONGODB_URI, {
//   keepAlive: true,
//   reconnectTries: Number.MAX_VALUE
// });
// mongoose.connection.openUri(process.env.MONGODB_URI)
//   .once('open', () => console.log('Database connection succes... '))
//   .on('error', (error) => {
//     console.warn('Warning', error);
//   });
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
})

module.exports = { mongoose }
