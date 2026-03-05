import { DesignWorkbench } from "../core/design/DesignWorkbench";
import { EntranceWorkspace } from "../modules/entrance/EntranceWorkspace";

export default function App() {
  return (
    <DesignWorkbench width={1920} height={1080}>
      <EntranceWorkspace />
    </DesignWorkbench>
  );
}
