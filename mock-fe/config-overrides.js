module.exports = function override(config, env) {
    config.devtool = false; // 关掉 sourceMap
    return config;
};