export interface RequestContext {
  request: Request;
  url: URL;
  clientAddress: string;
  params: Record<string, string | undefined>;
  locals: any;
}
