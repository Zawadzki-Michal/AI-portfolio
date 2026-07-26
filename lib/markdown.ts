/** Some models wrap their whole response in a ``` fence despite instructions not to. Strip it if present. */
export function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:markdown|md)?\n([\s\S]*)\n```$/);
  return fenced ? fenced[1].trim() : trimmed;
}
