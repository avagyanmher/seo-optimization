'use client'

import { useState } from 'react'
import { analyzeSeo } from '../actions/analyze-seo'
import SeoResults from './seo-results'

export default function SeoAnalyzer() {
  const [url, setUrl] = useState('')
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setResults(null)
    try {
      console.log('Submitting URL for analysis:', url)
      const data = await analyzeSeo(url)
      console.log('Analysis results:', data)
      setResults(data)
    } catch (err) {
      console.error('Error in handleSubmit:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred while analyzing the webpage.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex items-center border-b border-gray-300 py-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter webpage URL"
            required
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
          >
            {isLoading ? 'Analyzing...' : 'Analyze SEO'}
          </button>
        </div>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {results && <SeoResults results={results} />}
    </div>
  )
}

