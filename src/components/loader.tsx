import { Loader2 } from 'lucide-react'

const loader = () => {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex items-center justify-center space-x-2">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </div>
        </div>
    )
}

export default loader
