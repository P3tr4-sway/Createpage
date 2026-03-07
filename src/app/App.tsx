import { EntranceWorkspace } from "../features/entrance";
import { DesignWorkbenchShell } from "./shell/DesignWorkbenchShell";

export default function App() {
  return (
    <DesignWorkbenchShell>
      <EntranceWorkspace />
    </DesignWorkbenchShell>
  );
}
