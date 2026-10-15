const pluginRss = require("@11ty/eleventy-plugin-rss");
const fs = require("fs");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function(eleventyConfig) {
  // Add RSS plugin
  eleventyConfig.addPlugin(pluginRss);

  // Syntax highlighting for fenced code blocks (Prism, build-time)
  eleventyConfig.addPlugin(syntaxHighlight);

  // Mermaid: render ```mermaid fences as <pre class="mermaid"> (rendered client-side)
  eleventyConfig.amendLibrary("md", (mdLib) => {
    // Linkable section headings (h2/h3) so posts can be referenced by section
    mdLib.use(markdownItAnchor, {
      level: [2, 3],
      permalink: markdownItAnchor.permalink.headerLink({ safariReaderFix: true }),
    });

    const defaultFence = mdLib.renderer.rules.fence;
    mdLib.renderer.rules.fence = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      if (token.info.trim().split(/\s+/)[0].toLowerCase() === "mermaid") {
        return `<pre class="mermaid">${mdLib.utils.escapeHtml(token.content)}</pre>\n`;
      }
      return defaultFence(tokens, idx, options, env, self);
    };
  });
  
  // Add global data for PGP key
  eleventyConfig.addGlobalData("pgpKey", () => {
    return fs.readFileSync("src/pgp.txt", "utf8");
  });
  
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/theme.js");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/favicon.png");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/pgp.txt");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));


  // Approximate reading time, ignoring code blocks and markup
  eleventyConfig.addFilter("readingTime", (html) => {
    const text = String(html || "")
      .replace(/<pre[\s\S]*?<\/pre>/g, " ")
      .replace(/<[^>]+>/g, " ");
    const words = text.split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(words / 230))} min read`;
  });

  // Dates are stored as UTC midnight; format in UTC so they never shift a day
  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
  );

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
