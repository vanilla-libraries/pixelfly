type RecursiveArray = Array<RecursiveArray | string>;

/**
 * Javascript Hyperscript Function \
 * Creates HTML string elements instead of DOM nodes
 * @param tagName Element tag name
 * @param attributes Dictionary of element attributes
 * @param children Stringified HTML elements
 * @returns
 */
export function jsh(
  tagName: string,
  attributes: Record<string, unknown>,
  ...children: RecursiveArray
) {
  const attributesString = Object.keys(attributes)
    .reduce((acc: string[], key: string) => {
      return [...acc, `${key}="${String(attributes[key])}"`];
    }, [])
    .join(" ");

  const childrenString = children.flat().join(" ");

  return `<${tagName} ${attributesString}>${childrenString}</${tagName}>`;
}
