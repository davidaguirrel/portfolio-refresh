import { site } from "@/lib/site";

// Tells search engines who this site is about, in the schema.org format they read
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.jobTitle,
  url: site.url,
  sameAs: site.profiles,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Málaga",
    addressCountry: "ES",
  },
};

export function PersonJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(person).replace(/</g, "\\u003c"),
      }}
    />
  );
}
