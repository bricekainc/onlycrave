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

    // Helper to extract meta tag content using regex
    const getMeta = (prop: string) => {
      const regex = new RegExp(`<meta\\s+(?:property|name)=["']${prop}["']\\s+content=["']([^"']*)["']`, "i");
      const match = html.match(regex);
      if (match && match[1]) return match[1].trim();
      
      const reverseRegex = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+(?:property|name)=["']${prop}["']`, "i");
      const reverseMatch = html.match(reverseRegex);
      return reverseMatch && reverseMatch[1] ? reverseMatch[1].trim() : "";
    };

    // Helper to extract a tag attribute or inner text using regex
    const getAttrByClass = (className: string, attr: string) => {
      const regex = new RegExp(`<[^>]+class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*${attr}=["']([^"']*)["']`, "i");
      const match = html.match(regex);
      return match ? match[1] : "";
    };

    const getTextByClass = (className: string) => {
      const regex = new RegExp(`<[^>]+class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, "i");
      const match = html.match(regex);
      if (!match) return "";
      // Strip inner tags to get plain text
      return match[1].replace(/<[^>]*>/g, "").trim();
    };

    const avatar =
      getAttrByClass("avatarUser", "src") ||
      getMeta("og:image") ||
      getMeta("twitter:image") ||
      "";

    const coverStyleRegex = /<[^>]+class=["'][^"']*jumbotron-cover-user[^"']*["'][^>]*style=["']([^"']*)["']/i;
    const coverStyleMatch = html.match(coverStyleRegex);
    const coverStyle = coverStyleMatch ? coverStyleMatch[1] : "";

    const coverMatch = coverStyle.match(/url\(\s*['"]?(.*?)['"]?\s*\)/i);

    const cover =
      coverMatch?.[1] ||
      getAttrByClass("jumbotron-cover-user", "src") ||
      "";

    const name =
      getTextByClass("media-body") ||
      getMeta("og:title");

    const usernameMatch = html.match(/<small[^>]+class=["'][^"']*text-muted[^"']*["'][^>]*>([\s\S]*?)<\/small>/i);
    const username = usernameMatch ? usernameMatch[1].replace(/<[^>]*>/g, "").trim() : "";

    const bioMatch = html.match(/<div[^>]+class=["'][^"']*media-body[^"']*["'][^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    const bio = bioMatch ? bioMatch[1].replace(/<[^>]*>/g, "").trim() : "";

    const descMatch = html.match(/<[^>]+itemprop=["']description["'][^>]*>([\s\S]*?)<\/[^>]+>/i);
    const story =
      (descMatch ? descMatch[1].replace(/<[^>]*>/g, "").trim() : "") ||
      getMeta("og:description");

    const profile: Profile = {
      url: parsedUrl.toString(),
      name,
      username,
      avatar: absoluteUrl(avatar),
      cover: absoluteUrl(cover),
      bio,
      story,
    };

    return res.status(200).json(profile);
  } catch {
    return res.status(502).json({
      error: "Unable to retrieve the target profile",
    });
  }
}
