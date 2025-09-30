import sequelize from '../config/database.js';

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(
            '✅ Database connection has been established successfully.',
        );

        // Sync database in development
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('✅ Database synchronized successfully.');
        }
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};

export const closeDB = async () => {
    try {
        await sequelize.close();
        console.log('✅ Database connection closed successfully.');
    } catch (error) {
        console.error('❌ Error closing database connection:', error);
    }
};
