import { EndActivityControl, type EndActivityControlProps } from "./EndActivityControl";

type ExitActivityButtonProps = Omit<EndActivityControlProps, "kind">;

/** Non-exam study activities — alias for {@link EndActivityControl} with `kind="activity"`. */
export function ExitActivityButton(props: ExitActivityButtonProps) {
  return <EndActivityControl kind="activity" {...props} />;
}
