

const {
    createLogger,
    transports,
    format
} = require('winston');
require('winston-mongodb');
const logger = createLogger({
    transports: [
        // new transports.Console({
        //     // filename: 'info.log',
        //     level: 'info',
        //     format: format.combine(format.timestamp(), format.json())
        // }),
        new transports.File({
            filename: 'info.log',
            level: 'error',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.MongoDB({
            level: 'info',
            db: process.env.DB,
            options: {
                useUnifiedTopology: true
            },
            collection: 'log',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = logger;