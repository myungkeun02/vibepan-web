import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';

import Mascot from './Mascot';
export default async function ViewBrandIntroastro(props: Record<string, any> & { children?: ReactNode }) {
  return (
    <>
      <div className={'brand-intro'}>
        <div className={'brand-intro-copy'}>{props.children}</div>
        <Mascot />
      </div>
    </>
  );
}
