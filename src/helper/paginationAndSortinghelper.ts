type IOptions = {
    page: number ;
    limit: number ;
    skip: number;
    sortBy: string;
    sorOrderBy: string
}
export const paginationSortingHelper = (option: any): IOptions => {
    const page: number = Number(option.page) || 1;
    const limit: number = Number(option.limit) || 4;
    const skip = (page - 1) * limit;
    const sortBy:string = option.sortBy || 'createdAt';
    const sorOrderBy:string = option.orderBy || 'desc';
    return {
        page, limit, skip, sortBy, sorOrderBy
    }
}
