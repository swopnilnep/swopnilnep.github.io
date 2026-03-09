const pluginRss = require("@11ty/eleventy-plugin-rss");
const fs = require("fs");

module.exports = function(eleventyConfig) {
  // Add RSS plugin
  eleventyConfig.addPlugin(pluginRss);
  
  // Add global data for PGP key
  eleventyConfig.addGlobalData("pgpKey", () => {
    return fs.readFileSync("src/pgp.txt", "utf8");
  });
  
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/favicon.png");
  eleventyConfig.addPassthroughCopy("src/pgp.txt");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  
  // Create blog collection
  eleventyConfig.addCollection("post", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md");
  });
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk"
  };
};
