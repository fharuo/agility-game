/* Replicates the multi-outline geometric corner shapes from the Nuclea mockups */
export default function CornerDecos() {
  const shape = (
    <g stroke="none" fill="none">
      {/* Layered outlines: outer=purple, mid=lime, inner=cyan */}
      <polyline points="0,60 0,0 60,0" stroke="#6b3fa8" strokeWidth="1.5" />
      <polyline points="4,56 4,4 56,4"  stroke="#c6f135" strokeWidth="1.5" />
      <polyline points="8,52 8,8 52,8"  stroke="#00e5b0" strokeWidth="1.5" />
      <polyline points="12,48 12,12 48,12" stroke="#6b3fa8" strokeWidth="1" />
    </g>
  );

  return (
    <>
      {/* Top-left */}
      <div style={{ position:'absolute', top:12, left:12, zIndex:0, opacity:0.6 }}>
        <svg width="70" height="70" viewBox="0 0 70 70">{shape}</svg>
      </div>
      {/* Top-right — rotated 90° */}
      <div style={{ position:'absolute', top:12, right:12, zIndex:0, opacity:0.6, transform:'rotate(90deg)' }}>
        <svg width="70" height="70" viewBox="0 0 70 70">{shape}</svg>
      </div>
      {/* Bottom-left — rotated 270° */}
      <div style={{ position:'absolute', bottom:12, left:12, zIndex:0, opacity:0.6, transform:'rotate(270deg)' }}>
        <svg width="70" height="70" viewBox="0 0 70 70">{shape}</svg>
      </div>
      {/* Bottom-right — rotated 180° */}
      <div style={{ position:'absolute', bottom:12, right:12, zIndex:0, opacity:0.6, transform:'rotate(180deg)' }}>
        <svg width="70" height="70" viewBox="0 0 70 70">{shape}</svg>
      </div>
    </>
  );
}
