// This file is required to teach the Metro bundler how to handle .svg files.
// Learn more: https://github.com/kristerkari/react-native-svg-transformer
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 1. Find the babelTransformerPath
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer'
);

// 2. Add 'svg' to 'sourceExts' so Metro can import it as a component
config.resolver.sourceExts.push('svg');

// 3. Remove 'svg' from 'assetExts' so it's not treated as a static image
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);

module.exports = config;