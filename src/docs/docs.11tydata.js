// Every guide in this folder uses the doc layout and lives at /docs/<file>/.
export default {
  layout: "layouts/doc.njk",
  permalink: (data) => `/docs/${data.page.fileSlug}/`
};
