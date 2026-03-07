export interface Paper {
    id: number;
    title: string;
    authors: string | string[];
    abstract: string;
    publish_date: string;
    source_url?: string;
    url?: string;
    year?: number;
    venue?: string;
    citations?: number;
    workspace_id?: number;
}