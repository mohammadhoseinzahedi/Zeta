export function pagination(page: number = 1, limit: number = 10) {
  return {
    take: limit,
    skip: limit * (page - 1),
  };
}
