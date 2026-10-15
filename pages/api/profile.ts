```typescript
import type { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";

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
    const $ = cheerio.load(html);

    const absoluteUrl = (value?: string) => {
      if (!value) return "";

      try {
        return new URL(value, parsedUrl).href;
      } catch {
        return "";
      }
    };

    const meta = (property: string) =>
      $(`meta[property="${property}"]`).attr("content") ||
      $(`meta[name="${property}"]`).attr("content") ||
      "";

    const avatar =
      $(".avatarUser").first().attr("src") ||
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    const coverStyle =
      $(".jumbotron-cover-user").first().attr("style") || "";

    const coverMatch = coverStyle.match(
      /url\(\s*['"]?(.*?)['"]?\s*\)/i
    );

    const cover =
      coverMatch?.[1] ||
      $(".jumbotron-cover-user img").first().attr("src") ||
      "";

    const name =
      $(".media-body h4").first().clone().children().remove().end().text().trim() ||
      meta("og:title");

    const username =
      $(".media-body h4 small.text-muted").first().text().trim();

    const bio =
      $(".media-body h4").first().parent().find("p").first().text().trim();

    const story =
      $('[itemprop="description"]').first().text().trim() ||
      meta("og:description");

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
```
