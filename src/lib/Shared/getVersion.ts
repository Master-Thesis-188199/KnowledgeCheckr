'use server'

import version from '@/public/version.json'

export default async function getVersion() {
  return version.version
}
