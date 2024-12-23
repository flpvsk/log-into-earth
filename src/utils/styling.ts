export function cx(classMap: Record<string, boolean>): string {
  const classes: Set<string> = new Set()
  for (const [key, val] of Object.entries(classMap)) {
    if (val) classes.add(key)
  }

  return Array.from(classes).join(" ")
}
