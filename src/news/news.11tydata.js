// Every post in this folder uses the post layout and lives at /news/<file>/.
// Set `draft: true` to keep a post out of the site and the feed.
export default {
  layout: "layouts/post.njk",
  permalink: (data) => (data.draft ? false : `/news/${data.page.fileSlug}/`)
};
