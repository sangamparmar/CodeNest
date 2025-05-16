import { useAppContext } from "@/context/AppContext.tsx"
import useResponsive from "@/hooks/useResponsive.tsx"
import { ACTIVITY_STATE } from "@/types/app"
import DrawingEditor from "../drawing/DrawingEditor.tsx"
import EditorComponent from "../editor/EditorComponent.tsx"

function WorkSpace() {
    const { viewHeight } = useResponsive()
    const { activityState } = useAppContext()

    return (
        <div
            className="absolute left-0 top-0 w-full max-w-full flex-grow overflow-x-hidden md:static"
            style={{ height: viewHeight }}
        >
            {activityState === ACTIVITY_STATE.DRAWING ? (
                <DrawingEditor />
            ) : (
                <EditorComponent />
            )}
        </div>
    )
}

export default WorkSpace
