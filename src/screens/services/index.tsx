import { createMetadata } from '../../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../../lib/jsx';
import { getPageContext } from '../../lib/server-context';

export default async function Viewindexastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return <></>;
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return createMetadata({}, ctx.url.pathname);
}
