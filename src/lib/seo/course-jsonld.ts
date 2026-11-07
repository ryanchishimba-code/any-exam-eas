/**
 * schema.org Course JSON-LD used instead of Product.
 *
 * Product snippets in Search Console ask for aggregateRating. There are no
 * review aggregates to publish, so these pages do not use a Product type.
 *
 * Google Course info (developers.google.com/search/docs/appearance/structured-data/course-info):
 * - offers.category is one of Free, Subscription, Partially Free, Paid
 * - courseMode is one of Online, Onsite, Blended
 * schema.org CourseInstance.courseMode is Text; examples use "online".
 * Google's Course info enum for that same online delivery is "Online".
 *
 * courseSchedule and courseWorkload are required for the Course info rich
 * result, and aggregateRating is only recommended. This subscription has no
 * single published duration and no real rating aggregate, so those fields
 * are omitted rather than invented.
 */

export const SCHEMA_BRAND_NAME = "AnyExamEasy";

/** Google Course info `offers.category` values. */
export const GOOGLE_COURSE_OFFER_CATEGORIES = [
  "Free",
  "Subscription",
  "Partially Free",
  "Paid",
] as const;

export type GoogleCourseOfferCategory = (typeof GOOGLE_COURSE_OFFER_CATEGORIES)[number];

/** Google Course info `courseMode` values. */
export const GOOGLE_COURSE_MODES = ["Online", "Onsite", "Blended"] as const;

export type GoogleCourseMode = (typeof GOOGLE_COURSE_MODES)[number];

/** Self-paced web delivery. Google's enum value, not the schema.org example casing. */
export const ONLINE_COURSE_MODE: GoogleCourseMode = "Online";

/** Google Course info description maximum. */
export const COURSE_DESCRIPTION_MAX = 500;

const PRODUCT_RICH_RESULT_TYPES = new Set(["Product", "ProductGroup"]);
const RATING_KEYS = new Set([
  "aggregateRating",
  "review",
  "reviews",
  "reviewRating",
  "ratingValue",
  "reviewCount",
  "ratingCount",
]);

const PRICE_IN_NAME = /\$\s?\d|\d+\s*%|\bpercent off\b|\bonly\s+\$/i;

export type CourseOfferInput = {
  name?: string;
  price: string | number;
  priceCurrency: string;
  url: string;
  description?: string;
  availability?: string;
  priceValidUntil?: string;
  priceSpecification?: Record<string, unknown>;
};

function offerPrice(price: string | number): string {
  if (typeof price === "number") return price.toFixed(2);
  return price;
}

function absoluteHttpUrl(value: string): boolean {
  return /^https?:\/\/[^\s]+$/i.test(value);
}

export function buildCourseJsonLd(input: {
  name: string;
  description: string;
  url: string;
  providerUrl: string;
  image?: string;
  offers: CourseOfferInput | CourseOfferInput[];
  educationalLevel?: string;
  inLanguage?: string;
}): Record<string, unknown> {
  const offers = (Array.isArray(input.offers) ? input.offers : [input.offers]).map((offer) => {
    const node: Record<string, unknown> = {
      "@type": "Offer",
      category: "Subscription" satisfies GoogleCourseOfferCategory,
      price: offerPrice(offer.price),
      priceCurrency: offer.priceCurrency,
      url: offer.url,
    };
    if (offer.name) node.name = offer.name.replaceAll("Any Exam Easy", SCHEMA_BRAND_NAME);
    if (offer.description) node.description = offer.description;
    if (offer.availability) node.availability = offer.availability;
    if (offer.priceValidUntil) node.priceValidUntil = offer.priceValidUntil;
    if (offer.priceSpecification) node.priceSpecification = offer.priceSpecification;
    return node;
  });

  const course: Record<string, unknown> = {
    "@type": "Course",
    name: input.name,
    description: input.description.trim(),
    url: input.url,
    provider: {
      "@type": "Organization",
      name: SCHEMA_BRAND_NAME,
      url: input.providerUrl,
    },
    offers,
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: ONLINE_COURSE_MODE,
      },
    ],
  };
  if (input.image) course.image = input.image;
  if (input.educationalLevel) course.educationalLevel = input.educationalLevel;
  if (input.inLanguage) course.inLanguage = input.inLanguage;
  return course;
}

function schemaTypes(node: Record<string, unknown>): string[] {
  const type = node["@type"];
  if (typeof type === "string") return [type];
  if (Array.isArray(type)) return type.filter((item): item is string => typeof item === "string");
  return [];
}

function walk(value: unknown, visit: (node: Record<string, unknown>) => void): void {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit);
    return;
  }
  if (!value || typeof value !== "object") return;
  const node = value as Record<string, unknown>;
  visit(node);
  for (const child of Object.values(node)) walk(child, visit);
}

function graphNodes(data: Record<string, unknown>): Record<string, unknown>[] {
  const graph = data["@graph"];
  if (Array.isArray(graph)) return graph.filter((node): node is Record<string, unknown> => !!node && typeof node === "object");
  return [data];
}

/**
 * Issues that would keep a Product rich result, invent a rating, or miss
 * the Course fields Google and schema.org require for this markup.
 * Does not require courseSchedule or courseWorkload.
 */
export function findCourseSchemaIssues(data: Record<string, unknown>): string[] {
  const issues: string[] = [];
  const nodes = graphNodes(data);
  const courses = nodes.filter((node) => schemaTypes(node).includes("Course"));

  walk(data, (node) => {
    for (const type of schemaTypes(node)) {
      if (PRODUCT_RICH_RESULT_TYPES.has(type)) {
        issues.push(`Product rich-result type "${type}" is still present`);
      }
    }
    for (const key of Object.keys(node)) {
      if (RATING_KEYS.has(key)) {
        issues.push(`Rating field "${key}" is present`);
      }
    }
    if (typeof node.name === "string" && node.name.includes("Any Exam Easy")) {
      issues.push(`Schema name still uses spaced brand: ${node.name}`);
    }
  });

  if (courses.length === 0) {
    issues.push("Missing Course");
    return issues;
  }

  for (const course of courses) {
    issues.push(...validateCourseNode(course));
  }
  return issues;
}

export function validateCourseNode(course: Record<string, unknown>): string[] {
  const issues: string[] = [];
  const name = course.name;
  const description = course.description;
  const url = course.url;
  const provider = course.provider;
  const offers = course.offers;
  const instances = course.hasCourseInstance;

  if (typeof name !== "string" || name.trim().length === 0) {
    issues.push("Course.name is required");
  } else if (PRICE_IN_NAME.test(name)) {
    issues.push(`Course.name must not include a price or discount: ${name}`);
  } else if (!name.includes(SCHEMA_BRAND_NAME)) {
    issues.push(`Course.name must use ${SCHEMA_BRAND_NAME}: ${name}`);
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    issues.push("Course.description is required");
  } else if (description.length > COURSE_DESCRIPTION_MAX) {
    issues.push(
      `Course.description is ${description.length} characters; Google Course info max is ${COURSE_DESCRIPTION_MAX}`
    );
  }

  if (typeof url !== "string" || !absoluteHttpUrl(url)) {
    issues.push("Course.url must be an absolute http(s) URL");
  }

  if (!provider || typeof provider !== "object" || Array.isArray(provider)) {
    issues.push("Course.provider Organization is required");
  } else {
    const org = provider as Record<string, unknown>;
    if (org["@type"] !== "Organization") issues.push("Course.provider @type must be Organization");
    if (org.name !== SCHEMA_BRAND_NAME) {
      issues.push(`Course.provider.name must be ${SCHEMA_BRAND_NAME}`);
    }
    if (typeof org.url !== "string" || !absoluteHttpUrl(org.url)) {
      issues.push("Course.provider.url must be an absolute http(s) URL");
    }
  }

  const offerList = Array.isArray(offers) ? offers : offers ? [offers] : [];
  if (offerList.length === 0) {
    issues.push("Course.offers is required when a subscription price is published");
  }
  for (const offer of offerList) {
    if (!offer || typeof offer !== "object") {
      issues.push("Course.offers entry must be an Offer");
      continue;
    }
    const node = offer as Record<string, unknown>;
    if (node["@type"] !== "Offer") issues.push("Course.offers @type must be Offer");
    if (!GOOGLE_COURSE_OFFER_CATEGORIES.includes(node.category as GoogleCourseOfferCategory)) {
      issues.push(
        `Course.offers.category must be one of ${GOOGLE_COURSE_OFFER_CATEGORIES.join(", ")}`
      );
    }
    if (node.category !== "Subscription") {
      issues.push('Course.offers.category must be "Subscription" for Pro access');
    }
    if (typeof node.price !== "string" || !/^\d+\.\d{2}$/.test(node.price)) {
      issues.push("Course.offers.price must be a decimal USD amount");
    }
    if (node.priceCurrency !== "USD") issues.push("Course.offers.priceCurrency must be USD");
    if (typeof node.url !== "string" || !absoluteHttpUrl(node.url)) {
      issues.push("Course.offers.url must be an absolute http(s) URL");
    }
  }

  const instanceList = Array.isArray(instances) ? instances : instances ? [instances] : [];
  if (instanceList.length === 0) issues.push("Course.hasCourseInstance is required");
  for (const instance of instanceList) {
    if (!instance || typeof instance !== "object") {
      issues.push("Course.hasCourseInstance entry must be a CourseInstance");
      continue;
    }
    const node = instance as Record<string, unknown>;
    if (node["@type"] !== "CourseInstance") {
      issues.push("Course.hasCourseInstance @type must be CourseInstance");
    }
    if (!GOOGLE_COURSE_MODES.includes(node.courseMode as GoogleCourseMode)) {
      issues.push(`CourseInstance.courseMode must be one of ${GOOGLE_COURSE_MODES.join(", ")}`);
    }
    if (node.courseMode !== ONLINE_COURSE_MODE) {
      issues.push(`CourseInstance.courseMode must be ${ONLINE_COURSE_MODE}`);
    }
  }

  return issues;
}
