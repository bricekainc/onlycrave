
export async function getServerSideProps(context: any) {
  const rawUsername = context.params?.username;

  if (
    typeof rawUsername !== "string" ||
    !rawUsername.trim()
  ) {
    return { notFound: true };
  }

  const username = rawUsername.trim().toLowerCase();
  const targetUrl = `https://onlycrave.com/${encodeURIComponent(username)}`;

  const response = await fetch(targetUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(15000),
  }).catch((error) => {
    console.error("OnlyCrave request failed:", error);
    throw new Error(`Could not fetch OnlyCrave profile: ${username}`);
  });

  if (response.status === 404) {
    return { notFound: true };
  }

  if (!response.ok) {
    throw new Error(
      `OnlyCrave returned HTTP ${response.status} for ${username}`
    );
  }

  const html = await response.text();

  // Decode HTML entities without adding any placeholder values.
  const decodeHtml = (value: string): string =>
    value
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&#(\d+);/g, (_, code) =>
        String.fromCodePoint(Number(code))
      )
      .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
        String.fromCodePoint(parseInt(code, 16))
      )
      .trim();

  // Read an HTML tag attribute regardless of attribute order.
  const getAttribute = (
    tag: string,
    attribute: string
  ): string | null => {
    const escapedAttribute = attribute.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const match = tag.match(
      new RegExp(
        `\\b${escapedAttribute}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
        "i"
      )
    );

    const value = match?.[1] ?? match?.[2] ?? match?.[3];

    return value ? decodeHtml(value) : null;
  };

  // Extract a meta tag by its name/property key.
  const getMeta = (key: string): string | null => {
    const tags = html.match(/<meta\b[^>]*>/gi) ?? [];

    for (const tag of tags) {
      const name = getAttribute(tag, "name");
      const property = getAttribute(tag, "property");

      if (
        (name?.toLowerCase() === key.toLowerCase() ||
          property?.toLowerCase() === key.toLowerCase())
      ) {
        const content = getAttribute(tag, "content");

        if (content) return content;
      }
    }

    return null;
  };

  // Extract the actual profile avatar, not the site's generic OG image.
  const imageTags = html.match(/<img\b[^>]*>/gi) ?? [];

  const avatarTag = imageTags.find((tag) => {
    const className = getAttribute(tag, "class") ?? "";
    return className.split(/\s+/).includes("avatarUser");
  });

  const avatarSrc = avatarTag
    ? getAttribute(avatarTag, "src")
    : null;

  const avatarAlt = avatarTag
    ? getAttribute(avatarTag, "alt")
    : null;

  // Extract the visible profile name from the profile heading.
  const headingMatch = html.match(
    /<div\b[^>]*class=["'][^"']*\bmedia-body\b[^"']*["'][^>]*>[\s\S]*?<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i
  );

  let headingName: string | null = null;

  if (headingMatch?.[1]) {
    const headingText = headingMatch[1]
      .replace(/<small\b[^>]*>[\s\S]*?<\/small>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (headingText) {
      headingName = decodeHtml(headingText);
    }
  }

  // Extract the original description from the target page's metadata.
  const description =
    getMeta("og:description") ??
    getMeta("twitter:description") ??
    getMeta("description");

  // Require real values from the target page. Do not substitute defaults.
  const name = headingName ?? avatarAlt;

  if (!name) {
    throw new Error(
      `Could not extract the creator's name from ${targetUrl}`
    );
  }

  if (!avatarSrc) {
    throw new Error(
      `Could not extract the creator's avatar from ${targetUrl}`
    );
  }

  if (!description) {
    throw new Error(
      `Could not extract the creator's description from ${targetUrl}`
    );
  }

  // Resolve relative image URLs against the target page.
  const avatar = new URL(avatarSrc, targetUrl).toString();

  const creator = {
    username,
    name,
    avatar,
    description,
  };

  return {
    props: {
      creator,
      targetUrl,
    },
  };
}
