export default function Text({ color, children }) {
    const className = `text-md w-fit ${color}`
    return (<p className={className}>
        {children}
    </p>)
}