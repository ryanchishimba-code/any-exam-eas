/**
 * Remounts on each app navigation so the soft enter animation runs on main
 * content while AppShell chrome (nav/sidebar) stays painted.
 */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <div className="aee-route-enter">{children}</div>;
}
