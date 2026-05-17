export const canonicalizeLatin = (latin: string) => {
  return latin
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((w, i) => (i === 0 ? capitalize(w) : w.toLowerCase()))
    .join(' ')
}

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

export const parseLatin = (latin: string) => {
  const parts = latin.split(' ')

  return {
    genus: parts[0],
    species: parts[1],
    rest: parts.slice(2),
  }
}

export const levenshtein = (a: string, b: string): number => {
  const lenA = a.length
  const lenB = b.length

  const matrix = Array.from({ length: lenA + 1 }, (_, i) =>
    Array.from({ length: lenB + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  )

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1

      const deletion = matrix[i - 1][j] + 1
      const insertion = matrix[i][j - 1] + 1
      const substitution = matrix[i - 1][j - 1] + cost

      matrix[i][j] = Math.min(deletion, insertion, substitution)
    }
  }

  return matrix[lenA][lenB]
}
