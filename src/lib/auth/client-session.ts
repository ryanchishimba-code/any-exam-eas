/**
 * NextAuth treats an explicit `null` session as "already checked, do not refetch".
 * A static board page can bake that null in. `undefined` lets the header load the signed-in menu.
 */
export function initialClientSession<T>(session: T | null | undefined): T | undefined {
  return session ?? undefined;
}
