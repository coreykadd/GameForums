require('dotenv').config(); //Init env variables

CONFIG = {} //Make this global to use all over the app

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '3000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mysql';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'name';
CONFIG.db_user = process.env.DB_USER || 'root';
CONFIG.db_password = process.env.DB_PASSWORD || '';

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'tokenSecret123';
CONFIG.refresh_encryption = process.env.REFRESH_ENCRYPTION || 'refreshSecret123';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '300';
CONFIG.refresh_expiration  = process.env.REFRESH_EXPIRATION || '10000';