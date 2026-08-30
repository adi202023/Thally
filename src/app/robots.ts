import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/docs/', '/api/docs/', '/api/mcp'],
        disallow: ['/dashboard/', '/audit/', '/review/', '/preview/'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/docs/', '/api/docs/', '/api/mcp'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/docs/', '/api/docs/', '/api/mcp'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/docs/', '/api/docs/', '/api/mcp'],
      },
    ],
    sitemap: 'https://thally.dev/sitemap.xml',
    host: 'https://thally.dev',
  }
}
