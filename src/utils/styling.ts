export function cx(classMap: Record<string, boolean>): string {
  const classes: Set<string> = new Set()
  for (const [key, val] of Object.entries(classMap)) {
    if (val) classes.add(key)
  }

  return Array.from(classes).join(" ")
}

export function hide(val: boolean): Record<string, boolean> {
  return {
    _isHidden: val,
    _isVisible: !val,
  }
}

export function show(val: boolean): Record<string, boolean> {
  return {
    _isHidden: !val,
    _isVisible: val,
  }
}
