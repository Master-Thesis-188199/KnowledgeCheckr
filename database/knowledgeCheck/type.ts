export interface DbKnowledgeCheck {
  id: string
  name: string
  description: string | null
  owner_id: string
  public_token: string | null
  openDate: string
  closeDate: string | null
  difficulty: number
  createdAt: string
  updatedAt: string
  expiresAt: string | null
}
