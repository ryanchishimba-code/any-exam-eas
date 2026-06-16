import { THEME_STORAGE_KEY } from "@/lib/theme/config";

/** Runs before paint to avoid light/dark flash on load. */
export function ThemeScript() {
 const script = `
(function () {
 try {
 var key = ${JSON.stringify(THEME_STORAGE_KEY)};
 var stored = localStorage.getItem(key);
 var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
 var theme =
 stored === "light" ? "light" :
 stored === "dark" ? "dark" :
 systemDark ? "dark" : "light";
 document.documentElement.dataset.theme = theme;
 document.documentElement.style.colorScheme = theme;
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
