interface Props {
  size?: 'small' | 'medium' | 'large';
}
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';

export default async function ViewMascotastro(props: Props & { children?: ReactNode }) {
  const { size = 'medium' } = props;

  const pixels = { small: 48, medium: 64, large: 88 }[size];
  return (
    <>
      <img
        className={cn(['mascot', `mascot-${size}`])}
        src={'/brand/vibepan-robot-128.webp'}
        srcSet={'/brand/vibepan-robot-128.webp 128w, /brand/vibepan-robot-256.webp 256w'}
        sizes={`${pixels}px`}
        width={pixels}
        height={pixels}
        alt={''}
        aria-hidden={'true'}
        decoding={'async'}
      />
    </>
  );
}
