interface Props {
  compact?: boolean;
}
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';

import Mascot from './Mascot';
export default async function ViewEmptyStateastro(props: Props & { children?: ReactNode }) {
  const { compact = false } = props;
  return (
    <>
      <div className={cn(['empty', 'mascot-state', { 'mascot-state-compact': compact }])}>
        <Mascot size={compact ? 'small' : 'large'} />
        <div className={'mascot-state-copy'}>{props.children}</div>
      </div>
    </>
  );
}
