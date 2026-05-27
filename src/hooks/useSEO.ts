import { useEffect } from "react";

export interface SEOSettings {
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
}

interface UseSEOProps {
  title: string;
  description?: string;
  image?: string;
  seoSettings?: SEOSettings;
}

/**
 * A highly performant, zero-dependency custom hook to dynamically update document head metadata
 * (title, description, and Open Graph tags) for SEO management in a React SPA.
 */
export function useSEO({ title, description, image, seoSettings }: UseSEOProps) {
  useEffect(() => {
    // 1. Resolve values with SEO settings as top-priority, and standard fields as fallback
    const resolvedTitle = seoSettings?.seo_title?.trim() || title;
    const resolvedDescription = seoSettings?.seo_description?.trim() || description || "";
    const resolvedImage = seoSettings?.seo_image?.trim() || image || "";

    // 2. Dynamically update document.title
    document.title = resolvedTitle;

    // Helper function to safely update or append meta tags
    const updateOrCreateMeta = (attributeName: string, attributeValue: string, content: string) => {
      if (!content) return;
      
      let metaElement = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      
      if (!metaElement) {
        metaElement = document.createElement("meta");
        metaElement.setAttribute(attributeName, attributeValue);
        document.head.appendChild(metaElement);
      }
      
      metaElement.setAttribute("content", content);
    };

    // 3. Update Standard Meta description
    updateOrCreateMeta("name", "description", resolvedDescription);

    // 4. Update Open Graph (Facebook/LinkedIn) Meta Tags
    updateOrCreateMeta("property", "og:title", resolvedTitle);
    updateOrCreateMeta("property", "og:description", resolvedDescription);
    updateOrCreateMeta("property", "og:type", "article");

    if (resolvedImage) {
      // Ensure image URL is absolute for crawler optimization
      const absoluteImage = resolvedImage.startsWith("http")
        ? resolvedImage
        : `${window.location.origin}${resolvedImage}`;
      updateOrCreateMeta("property", "og:image", absoluteImage);
    }

    // 5. Update Twitter Card Meta Tags for social sharing
    updateOrCreateMeta("name", "twitter:card", "summary_large_image");
    updateOrCreateMeta("name", "twitter:title", resolvedTitle);
    updateOrCreateMeta("name", "twitter:description", resolvedDescription);
    if (resolvedImage) {
      const absoluteImage = resolvedImage.startsWith("http")
        ? resolvedImage
        : `${window.location.origin}${resolvedImage}`;
      updateOrCreateMeta("name", "twitter:image", absoluteImage);
    }
  }, [title, description, image, seoSettings]);
}
