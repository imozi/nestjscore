module.exports = {
  apps: [
    {
      name: 'esed-backend',
      port: '3000',
      script: './dist/src/main.js',
      watch: true,
      ignore_watch: ['node_modules', 'public', 'logs'],
      autorestart: true,
    },
  ],
};
