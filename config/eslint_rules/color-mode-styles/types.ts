import { TSESTree } from '@typescript-eslint/utils'

export type OwnerSimple = {
  kind: 'simple'
  attrValue: TSESTree.JSXAttribute['value']
  classString: string
}

export type OwnerHelperSegment = {
  kind: 'helper-segment'
  callExpression: TSESTree.CallExpression
  argNode: TSESTree.Expression // Literal or TemplateLiteral (no expressions)
  classString: string
}

export type OwnerInfo = OwnerSimple | OwnerHelperSegment
