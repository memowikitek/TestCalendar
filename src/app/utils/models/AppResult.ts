export class AppResult<TData> {
    constructor(
        public isSuccess: boolean = false,
        public statusCode: number = 200,
        public errors: string[] = [],
        public data: TData | null = null,
        public paginationResult: PaginationResult = new PaginationResult()
    ) {}
}

export class PaginationResult {
    constructor(public pageNumber: number = 1, public pageSize: number = 10, public totalRecords: number = 0) {}

    get totalPages(): number {
        return Math.ceil(this.totalRecords / this.pageSize);
    }
}
