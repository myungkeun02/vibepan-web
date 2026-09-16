import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactNode,
  type ReactElement,
  type SelectHTMLAttributes,
} from 'react';
export function cn(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(cn).filter(Boolean).join(' ');
  return Object.entries(value)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(' ');
}
export function styleObject(value: string | CSSProperties): CSSProperties {
  if (typeof value !== 'string') return value;
  return Object.fromEntries(
    value
      .split(';')
      .filter((x) => x.includes(':'))
      .map((x) => {
        const at = x.indexOf(':');
        const key = x.slice(0, at).trim();
        return [
          key.startsWith('--') ? key : key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
          x.slice(at + 1).trim(),
        ];
      }),
  );
}
export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  let selected = props.defaultValue;
  const walk = (nodes: ReactNode): ReactNode =>
    Children.map(nodes, (node) => {
      if (!isValidElement<any>(node)) return node;
      const element = node as ReactElement<Record<string, any>>;
      if (element.type === 'option') {
        if (element.props.selected) selected = element.props.value;
        return cloneElement(element, { selected: undefined });
      }
      return element.props.children ? cloneElement(element, {}, walk(element.props.children)) : node;
    });
  const options = walk(children);
  return (
    <select key={String(selected ?? '')} {...props} defaultValue={selected}>
      {options}
    </select>
  );
}
