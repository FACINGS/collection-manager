export function CollectionStats({
  stats,
  collectionCreatedAt,
  collectionDescription,
}) {
  const statsContent = [
    ['Created', new Date(Number(collectionCreatedAt)).toLocaleString()],
    ['Assets', stats.assets ?? 0],
    ['Burned', stats.burned ?? 0],
    ['Templates', stats.templates],
    ['Schemas', stats.schemas],
  ];

  return (
    <section className="container">
      <h2 className="headline-2 my-8">Details</h2>
      <div className="flex flex-col md:flex-row gap-8 lg:gap-0">
        <div className="flex-1">
          <h3 className="title-1 mb-4">Description</h3>
          <p className="body-1">{collectionDescription}</p>
        </div>
        <div className="flex-1">
          <div className="w-full md:max-w-sm mx-auto">
            <h3 className="title-1 mb-4">Stats</h3>
            {statsContent.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between py-3 body-2 text-white border-b border-neutral-700"
              >
                <span>{label}</span>
                <span className="font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
