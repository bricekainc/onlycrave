import type { NextApiRequest, NextApiResponse } from "next";

type Profile = {
  url: string;
  name: string;
  username: string;
  avatar: string;
  cover: string;
  bio: string;
  story: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const target = req.query.url;

  if (typeof target !== "string") {
    return res.status(400).json({ error: "A profile URL is required" });
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(target);
  } catch {
    return res.status(400).json({ error: "Invalid profile URL" });
  }

  if (
    parsedUrl.protocol !== "https:" ||
    parsedUrl.hostname !== "onlycrave.com"
  ) {
    return res.status(400).json({
      error: "Only HTTPS onlycrave.com profile URLs are supported",
    });
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return res.status(502).json({
        error: `Target page returned HTTP ${response.status}`,
      });
    }

    const html = await response.text();

    const absoluteUrl = (value?: string) => {
      if (!value) return "";

      try {
        return new URL(value, parsedUrl).href;
      } catch {
        return "";
      }
    };

    // Helper to extract meta tag content using regex (handles multiple tags by matching all or specific attributes)
    const getMetaContent = (property: string) => {
      const regex = new RegExp(`<meta\\s+(?:property|name)=["']${property}["']\\s+content=["']([^"']*)["']`, "gi");
      const matches = [...html.matchAll(regex)];
      if (matches.length > 0) {
        // Return the last or most specific one (e.g. user upload avatar over default svg)
        for (const match of matches.reverse()) {
          if (match[1] && !match[1].includes("home_index.svg")) {
            return match[1].trim();
          }
        }
        return matches[0][1].trim();
      }
      
      const reverseRegex = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+(?:property|name)=["']${property}["']`, "gi");
      const reverseMatches = [...html.matchAll(reverseRegex)];
      if (reverseMatches.length > 0) {
        return reverseMatches[reverseMatches.length - 1][1].trim();
      }
      return "";
    };

    const getTagText = (tagName: string) => {
      const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
      const match = html.match(regex);
      return match ? match[1].replace(/<[^>]*>/g, "").trim() : "";
    };

    // Extract fields based on target site meta structure
    const avatar = getMetaContent("og:image") || getMetaContent("twitter:image") || "";
    
    // Title from og:site_name or fallback to <title>
    const siteName = getMetaContent("og:site_name");
    const rawTitle = getTagText("title");
    const name = siteName || rawTitle.split("-")[0].trim() || getMetaContent("twitter:title");

    // Username derived from path (e.g. /njokimurira -> njokimurira)
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
    const username = pathSegments[pathSegments.length - 1] || "";

    // Bio and Story from og:description
    const description = getMetaContent("og:description") || getMetaContent("twitter:description") || "";

    const profile: Profile = {
      url: parsedUrl.toString(),
      name,
      username: username ? `@${username}` : "",
      avatar: absoluteUrl(avatar),
      cover: "", // Can be filled if cover meta exists
      bio: description,
      story: description,
    };

    return res.status(200).json(profile);
  } catch {
    return res.status(502).json({
      error: "Unable to retrieve the target profile",
    });
  }
}
