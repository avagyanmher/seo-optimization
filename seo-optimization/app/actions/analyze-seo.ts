'use server'

import { extractKeywords, checkAltTags, calculateSeoScore, parseHtml } from '../utils/seo-utils'

export async function analyzeSeo(url: string) {
  console.log('Starting SEO analysis for URL:', url)
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SEOAnalyzerBot/1.0',
      },
    })
    
    console.log('Fetch response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const html = await response.text()
    console.log('HTML content length:', html.length)

    const { title, description, h1, bodyText } = parseHtml(html)
    console.log('Parsed HTML:', { title, description, h1: h1.substring(0, 50) + '...' })

    const keywords = extractKeywords(title, description, h1, bodyText)
    console.log('Extracted keywords:', keywords)

    const altTags = checkAltTags(html)
    console.log('Alt tags:', altTags)

    const score = calculateSeoScore(keywords, altTags)
    console.log('Calculated SEO score:', score)

    return {
      keywords,
      altTags,
      score
    }
  } catch (error) {
    console.error('Error in analyzeSeo:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to analyze the webpage: ${error.message}`)
    } else {
      throw new Error('An unknown error occurred while analyzing the webpage.')
    }
  }
}

