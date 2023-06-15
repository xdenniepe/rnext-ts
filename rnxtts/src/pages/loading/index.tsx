import LoadingSpinner from "~/components/loading/loading"

const LoadingPage = () => {
    return (
        <div className="absolute right-0 top-0 flex h-screen w-screen items-center justify-center align-middle">
            <LoadingSpinner size={40} />
        </div>
    )
}

export default LoadingPage
