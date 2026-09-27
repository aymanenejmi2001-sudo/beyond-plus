// Collection pagination — shared by the server page (?page=N) and the grid.
export const PAGE_SIZE = 16;

export const pageCount = (total: number) => Math.max(1, Math.ceil(total / PAGE_SIZE));
