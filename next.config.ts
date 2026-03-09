// next.config.js
module.exports = {
    // Habilitar modo standalone para Docker
    output: 'standalone',
    
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
      return config;
    },
  };
  