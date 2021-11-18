export class SearchPostDto {
  title?: string;
  body?: string;
  tag?: string;
  views?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}
