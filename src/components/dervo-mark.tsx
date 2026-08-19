/** The Dervo mark: three rounded bars forming a "D". */
export function DervoMark({
  size = 38,
  onDark = false,
}: {
  size?: number;
  onDark?: boolean;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect x="5" y="6" width="30" height="10" rx="5" fill="#aee37b" />
      <rect
        x="5"
        y="19"
        width="38"
        height="10"
        rx="5"
        fill={onDark ? "#f0fff4" : "#0464de"}
      />
      <rect
        x="5"
        y="32"
        width="30"
        height="10"
        rx="5"
        fill={onDark ? "rgba(240,255,244,.55)" : "#01092d"}
      />
    </svg>
  );
}
