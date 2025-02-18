export type PaginationOutputDto<Model> = {
  items: Model[]
  per_page: number
  total: number
  current_page: number
  last_page: number
}

export class PaginationOutputMapper {
  static toOutput<Model = any>(
    items: Model[],
    result: any,
  ): PaginationOutputDto<Model> {
    return {
      items,
      per_page: result.per_page,
      total: result.total,
      current_page: result.current_page,
      last_page: Math.ceil(result.total / result.per_page),
    }
  }
}
