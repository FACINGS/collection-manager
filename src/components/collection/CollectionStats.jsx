export function CollectionStats(stats) {
    return (
        <div className="flex flex-col md:max-w-auto max-w-fit">
            <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold">Collection stats</h1>
                <div className="flex gap-2 items-center">
                    <p>Assets:</p>
                    <p className="font-bold whitespace-nowrap">{stats.assets ?? 0}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <p>Burned:</p>
                    <p className="font-bold whitespace-nowrap">{stats.burned ?? 0}</p>                                
                </div>
                <div className="flex gap-2 items-center">
                    <p>Templates:</p>
                    <p className="font-bold whitespace-nowrap">{stats.templates}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <p>Schemas:</p>
                    <p className="font-bold whitespace-nowrap">{stats.schemas}</p>
                </div>
            </div>
        </div>
    )
}