module.exports = function (eleventyConfig) {
  return {
    dir: {
      input: "src/pages",
      includes: "_includes",
      output: "dist"
    }
  };
};

