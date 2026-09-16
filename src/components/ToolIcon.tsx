interface Props {
  app: { slug: string; name: string };
  imageUrl?: string;
}
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';

import icons from '../../data/icons.json';
export default async function ViewToolIconastro(props: Props & { children?: ReactNode }) {
  const { app, imageUrl } = props;

  const icon = imageUrl ? { src: imageUrl } : (icons as Record<string, { src?: string | null }>)[app.slug];
  return (
    <>
      <span
        className={cn(['tool-icon', { 'has-image': Boolean(icon?.src) }])}
        data-tool-icon={app.slug}
        aria-hidden={'true'}
      >
        {icon?.src && (
          <img
            data-tool-icon-image={''}
            src={icon.src}
            alt={''}
            width={'96'}
            height={'96'}
            decoding={'async'}
          />
        )}
        <span data-tool-icon-fallback={''} hidden={Boolean(icon?.src)}>
          {app.name.slice(0, 1)}
        </span>
      </span>
    </>
  );
}
