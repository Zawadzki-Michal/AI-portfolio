// Inline + synchronous so it runs before the rest of <body> paints,
// preventing a flash of the wrong theme on load. Must stay a plain
// script (no next/script) to guarantee it executes first, in-order.
const THEME_INIT = `(function(){try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.setAttribute("data-theme","light");}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />;
}
