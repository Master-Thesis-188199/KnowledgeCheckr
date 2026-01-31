import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

/**
 * This function computes the knowledge retainment score of a given user for a given check based on the difficulty and last practice / examination and the respective score.
 * The more time has passed and the more difficult a check is the faster knowledge degrades --> thus lower retainment score.
 * @param
 */
export function computeKnowledgeRetainment({ difficulty }: Pick<KnowledgeCheck, 'difficulty'>) {
  const randomScore = Math.random() * 100
  const skewedScore = randomScore * 1.7

  return skewedScore > 100 ? 100 : Math.floor(skewedScore)
}
