export default function TokenExpired (tokenDate) {
    if (!tokenDate)
    {
        return false
    }
    const msPerDay = 8.64e7
    const today = new Date()
    const diff = Math.round((today.getTime() - tokenDate.getTime()) / msPerDay); 
    return (diff > 1)
}