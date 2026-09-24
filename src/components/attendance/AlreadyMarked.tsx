import { CheckCircle2 } from "lucide-react"

const AlreadyMarked = () => {
    return (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Attendance for today has already been marked. You can't mark it again.
        </div>
    )
}

export default AlreadyMarked
