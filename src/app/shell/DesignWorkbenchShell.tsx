import { type ReactNode } from "react";
import { DesignWorkbench } from "../../core/design/DesignWorkbench";

interface DesignWorkbenchShellProps {
  children: ReactNode;
}

export function DesignWorkbenchShell({ children }: DesignWorkbenchShellProps) {
  return <DesignWorkbench width={1920} height={1080}>{children}</DesignWorkbench>;
}
