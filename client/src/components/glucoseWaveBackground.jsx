function GlucoseWaveBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg
        className="w-[200%] h-64 opacity-[0.08] dark:opacity-[0.12] animate-drift"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 L100,100 L130,40 L160,160 L190,100 L400,100 L430,40 L460,160 L490,100 L700,100 L730,40 L760,160 L790,100 L1000,100"
          fill="none"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default GlucoseWaveBackground;