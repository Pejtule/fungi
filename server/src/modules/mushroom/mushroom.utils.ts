export const buildMushroomFilter = (filters: Object) => {
  const orConditions = []

  for (const [key, values] of Object.entries(filters)) {
    if (!values || values.length === 0) continue

    if (values.length === 1) {
      orConditions.push({ [key]: values[0] })
    } else {
      orConditions.push({ [key]: { $in: values } })
    }
  }

  return orConditions.length > 0 ? { $or: orConditions } : {}
}
