/** Pins light before paint so a dark OS setting cannot flash a partial dark theme. */
export function ThemeScript() {
 const script = `
(function () {
 try {
 document.documentElement.dataset.theme = "light";
 document.documentElement.style.colorScheme = "light";
 } catch (e) {}
})();
`;

 return (
 <script
 dangerouslySetInnerHTML={{ __html: script }}
 suppressHydrationWarning
 />
 );
}
