module.exports = {
  apps: [{
    name: 'rest-api-dev',
    script: './src/app.ts',
    interpreter: 'node',
    interpreter_args: '-r ts-node/register',
    env: {
      NODE_ENV: 'development',
      PORT: 3003,
      MYSQL_HOST: 'localhost',
      MYSQL_PORT: 3306,
      MYSQL_USER: 'dev_user',
      MYSQL_PASSWORD: 'nvrs',
      MYSQL_DATABASE_NAME: 'nvrs_dev'
    },
    watch: ['src'],
    ignore_watch: ['node_modules', 'dist', 'data']
  }]
};
