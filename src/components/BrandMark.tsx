import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';

export default async function ViewBrandMarkastro(props: Record<string, any> & { children?: ReactNode }) {
  return (
    <>
      <img
        className={'brand-mark'}
        src={'/brand/vibepan-robot-128.webp'}
        width={'36'}
        height={'36'}
        alt={''}
        aria-hidden={'true'}
      />
    </>
  );
}
