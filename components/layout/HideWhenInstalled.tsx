/**
 * Hides "get the app" prompts for people who already have it. Done with CSS (the `app:` variant
 * set before the page draws), so the prompt never flashes on screen inside the app.
 */
export default function HideWhenInstalled({ children }: { children: React.ReactNode }) {
  return <div className="contents app:hidden">{children}</div>
}
