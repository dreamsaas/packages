/**
 * Convert JSX to DreamSaaS component config JSON
 */
export const convertJsxToJson = (root: JSX.Element) => {
  const { children: originalChildren = [], ...props } = root.props;

  const children =
    typeof originalChildren === "string"
      ? [originalChildren]
      : originalChildren.map((child: any) =>
          typeof child === "string" ? child : convertJsxToJson(child)
        );

  return {
    name: root.type?.name ?? (root.type || null),
    props: { ...props, children }
  };
};
