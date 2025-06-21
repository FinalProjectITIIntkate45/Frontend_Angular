export interface Pagination<T>{
    Data:Array<T>;
    PageNumber:number;
    PageSize:number;
    TotalCount:number;
}