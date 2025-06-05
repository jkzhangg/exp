const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // 自定义配置
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
  };

  // 禁用 source-map-loader
  config.module.rules = config.module.rules.filter(rule => {
    if (rule.use) {
      const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
      return !uses.some(use => 
        typeof use === 'string' 
          ? use === 'source-map-loader'
          : use.loader === 'source-map-loader'
      );
    }
    return true;
  });

  // 添加 source-map-loader 忽略规则
  config.ignoreWarnings = [
    {
      module: /node_modules\/@zxing\/browser/,
    }
  ];

  // 设置 process.env.NODE_ENV
  process.env.NODE_ENV = env.mode === 'production' ? 'production' : 'development';

  return config;
}; 