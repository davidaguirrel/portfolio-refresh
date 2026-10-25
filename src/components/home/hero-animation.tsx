// Decorative background for the hero, ported from the original site: faint
// rounded tracks with small comets travelling along them. Pure SVG, so it
// ships no JavaScript.

const tracks = [
  {
    id: "track-0",
    d: "M201.337 87.437C193.474 79.5738 180.725 79.5738 172.862 87.437L87.437 172.862C79.5739 180.725 79.5739 193.474 87.437 201.337L400.663 514.563C408.526 522.426 421.275 522.426 429.138 514.563L514.563 429.138C522.426 421.275 522.426 408.526 514.563 400.663L201.337 87.437ZM30.4869 115.912C-8.82897 155.228 -8.82897 218.972 30.4869 258.287L343.713 571.513C383.028 610.829 446.772 610.829 486.088 571.513L571.513 486.088C610.829 446.772 610.829 383.028 571.513 343.713L258.287 30.4869C218.972 -8.82896 155.228 -8.82896 115.912 30.4869L30.4869 115.912Z",
  },
  {
    id: "track-1",
    d: "M514.563 201.337C522.426 193.474 522.426 180.725 514.563 172.862L429.138 87.437C421.275 79.5738 408.526 79.5739 400.663 87.437L358.098 130.002L301.148 73.0516L343.713 30.4869C383.028 -8.82896 446.772 -8.82896 486.088 30.4869L571.513 115.912C610.829 155.228 610.829 218.972 571.513 258.287L357.802 471.999L300.852 415.049L514.563 201.337Z",
  },
  {
    id: "track-2",
    d: "M243.901 471.999L201.337 514.563C193.474 522.426 180.725 522.426 172.862 514.563L87.437 429.138C79.5739 421.275 79.5739 408.526 87.437 400.663L301.148 186.952L244.198 130.002L30.4869 343.713C-8.82897 383.028 -8.82897 446.772 30.4869 486.088L115.912 571.513C155.228 610.829 218.972 610.829 258.287 571.513L300.852 528.949L243.901 471.999Z",
  },
];

// Same colors, tracks, speeds and start delays as the original
const comets = [
  { track: "track-2", color: "#945dd6", dur: "10s", begin: "0s" },
  { track: "track-2", color: "#f46737", dur: "5s", begin: "1s" },
  { track: "track-0", color: "#945dd6", dur: "10s", begin: "0s" },
  { track: "track-0", color: "#f46737", dur: "10s", begin: "1s" },
  { track: "track-1", color: "#f46737", dur: "5s", begin: "0s" },
  { track: "track-0", color: "#f46737", dur: "10s", begin: "3s" },
  { track: "track-0", color: "#13adc7", dur: "12s", begin: "4s" },
];

export function HeroAnimation({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 602 602"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        {/* Tracks fade out towards the edges */}
        <radialGradient
          id="track-fade"
          cx="301"
          cy="301"
          r="300"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.33" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        {comets.map((comet, i) => (
          <linearGradient
            key={i}
            id={`comet-${i}`}
            x1="0"
            x2="-36"
            y1="0"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={comet.color} />
            <stop offset="1" stopColor={comet.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      <g opacity="0.15" stroke="url(#track-fade)">
        {tracks.map((track) => (
          <path key={track.id} id={track.id} d={track.d} />
        ))}
      </g>

      {/* Hidden for people who ask their system for less motion */}
      <g className="motion-reduce:hidden">
        {comets.map((comet, i) => (
          <g key={i}>
            <circle r="1.07" fill={comet.color} />
            <path d="M0 0 L-36 0" stroke={`url(#comet-${i})`} />
            <animateMotion
              dur={comet.dur}
              begin={comet.begin}
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href={`#${comet.track}`} />
            </animateMotion>
          </g>
        ))}
      </g>
    </svg>
  );
}
