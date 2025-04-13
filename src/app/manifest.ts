import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KnowledgeCheckr',
    short_name: 'KnowledgeCheckr',
    description: 'Learn and Practice using KnowledgeCheckr',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: 'KnowledgeCheckr.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],
  }
}
