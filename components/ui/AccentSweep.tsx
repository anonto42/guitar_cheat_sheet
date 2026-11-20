/**
 * Thin line along the top edge of a card. A bright segment of the card's accent colour sweeps
 * from left to right while the card is hovered or focused (and continuously on touch screens,
 * which have no hover). Put it inside an element with class `sweep-card`, `position: relative`
 * and a `--accent` custom property. Styles live in app/globals.css.
 */
export default function AccentSweep() {
  return <span aria-hidden="true" className="accent-sweep" />
}
