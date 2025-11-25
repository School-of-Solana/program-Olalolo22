const webpack = require('webpack');

module.exports = function override(config) {
  // --- FIX 1: Disable the "ModuleScopePlugin" ---
  // This solves the "You attempted to import ... outside of the project src/ directory" error.
  if (config.resolve.plugins) {
    config.resolve.plugins = config.resolve.plugins.filter(plugin =>
      !(plugin.constructor && plugin.constructor.name === "ModuleScopePlugin")
    );
  }

  // --- FIX 2: Polyfills for Web3 (Crypto, Stream, etc.) ---
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url"),
    "vm": require.resolve("vm-browserify"),
    "zlib": require.resolve("browserify-zlib")
  };

  // --- FIX 3: Provide global variables (process, Buffer) ---
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer']
    })
  ];

  // --- FIX 4: Handle .mjs files for Web3 libraries ---
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false
    }
  });
  
  // Cleanup warnings
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};