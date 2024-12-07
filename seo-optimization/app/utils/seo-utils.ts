export function parseHtml(html: string) {
  try {
    const getContent = (regex: RegExp) => {
      const match = html.match(regex)
      return match ? match[1] : ''
    }

    const title = getContent(/<title>(.*?)<\/title>/i)
    const description = getContent(/<meta\s+name="description"\s+content="(.*?)"/i)
    const h1 = getContent(/<h1>(.*?)<\/h1>/i)
    const bodyText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

    return { title, description, h1, bodyText }
  } catch (error) {
    console.error('Error in parseHtml:', error)
    throw new Error('Failed to parse HTML content')
  }
}

export function extractKeywords(title: string, description: string, h1: string, bodyText: string): string[] {
  try {
    const allText = `${title} ${description} ${h1} ${bodyText}`.toLowerCase()
    const words = allText.split(/\W+/)
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
    
    const wordFrequency: { [key: string]: number } = {}
    words.forEach(word => {
      if (word.length > 2 && !stopWords.has(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1
      }
    })

    return Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word)
  } catch (error) {
    console.error('Error in extractKeywords:', error)
    throw new Error('Failed to extract keywords')
  }
}

export function checkAltTags(html: string): { present: number; missing: number } {
  try {
    const imgTags = (html.match(/<img[^>]+>/g) || []).length
    const altTags = (html.match(/<img[^>]+alt=["'][^"']*["'][^>]*>/g) || []).length

    return {
      present: altTags,
      missing: imgTags - altTags
    }
  } catch (error) {
    console.error('Error in checkAltTags:', error)
    throw new Error('Failed to check alt tags')
  }
}

export function calculateSeoScore(keywords: string[], altTags: { present: number; missing: number }): number {
  try {
    const keywordScore = Math.min(keywords.length * 10, 50)
    const altTagScore = (altTags.present / (altTags.present + altTags.missing || 1)) * 50

    return Math.round(keywordScore + altTagScore)
  } catch (error) {
    console.error('Error in calculateSeoScore:', error)
    throw new Error('Failed to calculate SEO score')
  }
}

