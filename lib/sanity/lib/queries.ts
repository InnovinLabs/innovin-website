// defineQuery is a pass-through tag — replaced to avoid next-sanity Server Actions in static export
const defineQuery = (q: string) => q

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

// Job queries
const jobFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  heading,
  location,
  employmentType,
  "datePosted": coalesce(datePosted, _updatedAt),
  dateExpires,
  isActive,
`

export const allJobsQuery = defineQuery(`
  *[_type == "job" && defined(slug.current) && isActive == true] | order(datePosted desc, _updatedAt desc) {
    ${jobFields}
  }
`)

export const jobQuery = defineQuery(`
  *[_type == "job" && slug.current == $slug] [0] {
    ${jobFields}
    jobDescription[]{
      ...,
      markDefs[]{
        ...,
        ${linkReference}
      }
    },
    rolesAndResponsibilities[]{
      ...,
      markDefs[]{
        ...,
        ${linkReference}
      }
    },
    qualifications[]{
      ...,
      markDefs[]{
        ...,
        ${linkReference}
      }
    },
    benefits[]{
      ...,
      markDefs[]{
        ...,
        ${linkReference}
      }
    },
  }
`)

export const jobSlugs = defineQuery(`
  *[_type == "job" && defined(slug.current) && isActive == true]
  {"slug": slug.current}
`)

// Blog/Post queries
const postFields = /* groq */ `
  _id,
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture, description, linkedinUrl},
  "categories": categories[]->{_id, title, slug, description, color},
`

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const postsByCategoryQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && $categoryId in categories[]->_id] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const featuredPostQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
    ${postFields}
  }
`)

export const allCategoriesQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    color,
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
      ...,
      markDefs[]{
        ...,
        ${linkReference}
      }
    },
    ${postFields}
  }
`)

export const postSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const relatedPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && slug.current != $currentSlug && $categoryId in categories[]->_id] | order(date desc, _updatedAt desc) [0...3] {
    ${postFields}
  }
`)

