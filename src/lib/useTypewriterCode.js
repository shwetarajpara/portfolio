import { useEffect, useState, useRef } from 'react'

/**
 * Cycles through an array of code "lines" (each an array of {text, cls} tokens),
 * typing them out character by character, holding, then deleting and moving
 * to the next snippet. Returns the currently visible lines (already typed).
 */
export default function useTypewriterCode(snippets, { typeSpeed = 18, holdMs = 1600, deleteSpeed = 6 } = {}) {
  const [snippetIndex, setSnippetIndex] = useState(0)
  const [visibleLines, setVisibleLines] = useState([])
  const timeoutRef = useRef(null)

  useEffect(() => {
    const snippet = snippets[snippetIndex % snippets.length]
    const flatChars = snippet.map((line) => line.reduce((acc, tok) => acc + tok.text.length, 0))
    let lineIdx = 0
    let charIdx = 0
    let typedLines = snippet.map(() => [])

    const typeStep = () => {
      const line = snippet[lineIdx]
      if (!line) {
        timeoutRef.current = setTimeout(deleteAll, holdMs)
        return
      }
      const lineLen = flatChars[lineIdx]
      if (charIdx <= lineLen) {
        let remaining = charIdx
        const built = []
        for (const tok of line) {
          if (remaining <= 0) break
          const take = Math.min(remaining, tok.text.length)
          built.push({ text: tok.text.slice(0, take), cls: tok.cls })
          remaining -= take
        }
        typedLines[lineIdx] = built
        setVisibleLines(typedLines.map((l) => [...l]))
        charIdx++
        timeoutRef.current = setTimeout(typeStep, typeSpeed)
      } else {
        lineIdx++
        charIdx = 0
        timeoutRef.current = setTimeout(typeStep, typeSpeed * 4)
      }
    }

    const deleteAll = () => {
      let totalLines = typedLines.length
      const deleteStep = () => {
        if (totalLines <= 0) {
          setVisibleLines([])
          setSnippetIndex((i) => i + 1)
          return
        }
        typedLines = typedLines.slice(0, totalLines)
        typedLines[totalLines - 1] = []
        setVisibleLines(typedLines.map((l) => [...l]))
        totalLines--
        timeoutRef.current = setTimeout(deleteStep, deleteSpeed * 8)
      }
      deleteStep()
    }

    setVisibleLines([])
    timeoutRef.current = setTimeout(typeStep, 300)

    return () => clearTimeout(timeoutRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippetIndex])

  return { visibleLines }
}
