import View, { pageMetadata } from '../../../../screens/community/[id]/edit';
import { getPageContext } from '../../../../lib/server-context';
import { notFound } from 'next/navigation';
export const generateMetadata = pageMetadata;
export default async function Page(props: any) {
  if ((await getPageContext()).status === 404) notFound();
  return <View {...props} />;
}
