import type { Content } from 'newt-client-js'

export interface Category extends Content {
  emoji: {
    type: string
    value: string
  }
  name: string
  slug: string
  description: string
}
