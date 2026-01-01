import type { TSESLint, TSESTree } from '@typescript-eslint/utils'
import type { OwnerInfo } from './types'

export default function createFixableSuggestions(attrNode: TSESTree.JSXAttribute, owner: OwnerInfo, suggestedClasses: string, fixer: TSESLint.RuleFixer, sourceCode: TSESLint.SourceCode) {
  const value = attrNode.value
  if (!value) return null

  const appendTo = (existing: string) => (existing.trim() + ' ' + suggestedClasses).trim()

  // SIMPLE: className="..." / {'...'} / `...`
  if (owner.kind === 'simple') {
    const target = owner.attrValue!
    const newClassString = appendTo(owner.classString)

    if (target.type === 'Literal' && typeof target.value === 'string') {
      // preserve quote style
      const raw = sourceCode.getText(target) // e.g. "..." or '...'
      const quote = raw[0] === "'" || raw[0] === '"' ? raw[0] : '"'
      const newText = `${quote}${newClassString}${quote}`
      return fixer.replaceText(target, newText)
    }

    if (target.type === 'JSXExpressionContainer') {
      const expr = target.expression

      if (expr.type === 'Literal' && typeof expr.value === 'string') {
        const raw = sourceCode.getText(expr)
        const quote = raw[0] === "'" || raw[0] === '"' ? raw[0] : '"'
        const newText = `${quote}${newClassString}${quote}`
        return fixer.replaceText(expr, newText)
      }

      if (expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
        return fixer.replaceText(expr, '`' + newClassString + '`')
      }
    }

    return null
  }

  // HELPER SEGMENT: a specific cn/tw argument literal/template
  if (owner.kind === 'helper-segment') {
    const argNode = owner.argNode

    // Literal argument (including logical-expression right side we stored)
    if (argNode.type === 'Literal' && typeof argNode.value === 'string') {
      const newClassString = appendTo(owner.classString)
      const raw = sourceCode.getText(argNode) // e.g. "..." or '...'
      const quote = raw[0] === "'" || raw[0] === '"' ? raw[0] : '"'
      const newText = `${quote}${newClassString}${quote}`
      return fixer.replaceText(argNode, newText)
    }

    // Template literal argument with no expressions
    if (argNode.type === 'TemplateLiteral' && argNode.expressions.length === 0) {
      const newClassString = appendTo(owner.classString)
      return fixer.replaceText(argNode, '`' + newClassString + '`')
    }
  }

  return null
}
