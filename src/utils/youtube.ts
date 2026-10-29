/**
 * Converts any standard YouTube URL (watch, share, short, embed, or raw ID)
 * into a clean, responsive embed URL suitable for iframes.
 */
export function getYouTubeEmbedUrl(url: string | undefined): string {
  if (!url || typeof url !== 'string') {
    return 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Safe fallback
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  }

  // If already an embed url
  if (trimmed.includes('youtube.com/embed/')) {
    const clean = trimmed.split('?')[0];
    const match = clean.match(/youtube\.com\/embed\/([^/?#&]+)/);
    const videoId = match ? match[1] : '';
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
      : trimmed;
  }

  // Standard watch URL: youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([^&#]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0&modestbranding=1`;
  }

  // Short URL: youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([^?&#]+)/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0&modestbranding=1`;
  }

  // Shorts URL: youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^?&#]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}?rel=0&modestbranding=1`;
  }

  // Live URL: youtube.com/live/VIDEO_ID
  const liveMatch = trimmed.match(/youtube\.com\/live\/([^?&#]+)/);
  if (liveMatch && liveMatch[1]) {
    return `https://www.youtube.com/embed/${liveMatch[1]}?rel=0&modestbranding=1`;
  }

  // Raw 11-char Video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}?rel=0&modestbranding=1`;
  }

  return trimmed;
}

/**
 * Extracts pure YouTube Video ID for thumbnail generation or external link
 */
export function getYouTubeVideoId(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  const watchMatch = trimmed.match(/[?&]v=([^&#]+)/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  const shortMatch = trimmed.match(/youtu\.be\/([^?&#]+)/);
  if (shortMatch && shortMatch[1]) return shortMatch[1];

  const embedMatch = trimmed.match(/youtube\.com\/embed\/([^/?#&]+)/);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^?&#]+)/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  return null;
}
