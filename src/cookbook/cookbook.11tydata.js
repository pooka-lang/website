// Every recipe in this folder uses the recipe layout and lives at
// /cookbook/<file>/. A recipe with `draft: true` is listed on the cookbook
// page as "coming soon" but gets no page of its own.
export default {
  layout: "layouts/recipe.njk",
  permalink: (data) => (data.draft ? false : `/cookbook/${data.page.fileSlug}/`)
};
