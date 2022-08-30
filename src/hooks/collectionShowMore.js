export async function collectionShowMore({
  page,
  setPage,
  setIsLoading,
  service,
  collection,
  updateList,
  match,
}) {
  setIsLoading(true);
  const limit = 12;
  const newPage = page + 1;
  const offset = (page - 1) * limit;
  const { data } = await service({ collection, page: newPage, offset, match });
  setPage(newPage);
  updateList((value) => [...value, ...data.data]);
  setIsLoading(false);
}
