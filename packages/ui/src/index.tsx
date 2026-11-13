import type { ComponentProps } from "react";
/** Primitiva sem estilo; a identidade visual pertence à aplicação. */
export function Button({ type = "button", ...props }: ComponentProps<"button">) {
  return <button type={type} {...props} />;
}
