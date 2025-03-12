'use server'

import version from '@/public/version.json'

export const dynamic = 'force-static'

export default async function getVersion() {
  return version.version
}
