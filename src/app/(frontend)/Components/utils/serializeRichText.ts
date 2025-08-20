// Utility to serialize Lexical rich text content to HTML
export function serializeRichText(richTextObject: any): string {
  if (!richTextObject || !richTextObject.root || !richTextObject.root.children) {
    return ''
  }

  const serializeNode = (node: any): string => {
    if (!node) return ''

    switch (node.type) {
      case 'paragraph':
        const children = node.children || []
        const content = children.map(serializeNode).join('')
        return `<p>${content}</p>`

      case 'text':
        let text = node.text || ''
        
        // Apply formatting
        if (node.format) {
          if (node.format & 1) text = `<strong>${text}</strong>` // bold
          if (node.format & 2) text = `<em>${text}</em>` // italic
          if (node.format & 4) text = `<s>${text}</s>` // strikethrough
          if (node.format & 8) text = `<u>${text}</u>` // underline
        }
        
        return text

      case 'linebreak':
        return '<br>'

      case 'heading':
        const headingChildren = node.children || []
        const headingContent = headingChildren.map(serializeNode).join('')
        const tag = node.tag || 'h1'
        return `<${tag}>${headingContent}</${tag}>`

      case 'list':
        const listChildren = node.children || []
        const listContent = listChildren.map(serializeNode).join('')
        const listTag = node.listType === 'number' ? 'ol' : 'ul'
        return `<${listTag}>${listContent}</${listTag}>`

      case 'listitem':
        const listItemChildren = node.children || []
        const listItemContent = listItemChildren.map(serializeNode).join('')
        return `<li>${listItemContent}</li>`

      case 'link':
        const linkChildren = node.children || []
        const linkContent = linkChildren.map(serializeNode).join('')
        const url = node.url || '#'
        return `<a href="${url}" target="${node.newTab ? '_blank' : '_self'}">${linkContent}</a>`

      default:
        // For unknown node types, try to serialize children if they exist
        if (node.children && Array.isArray(node.children)) {
          return node.children.map(serializeNode).join('')
        }
        return ''
    }
  }

  try {
    const children = richTextObject.root.children || []
    return children.map(serializeNode).join('')
  } catch (error) {
    console.warn('Error serializing rich text:', error)
    return ''
  }
}