import { IComponentInstance } from "../context/ComponentRegistry";

/**
 * Convert JSX to DreamSaaS component config JSON
 */
export const convertJsxToJson = (root: JSX.Element): IComponentInstance => {
  const { children: originalChildren = [], state, ...props } = root.props;

  let children;

  if (!Array.isArray(originalChildren)) children = [originalChildren];

  children = children?.map((child: any) =>
    typeof child === "string" ? child : convertJsxToJson(child)
  );

  //   console.log("children", children);

  return {
    name: root.type?.name ?? (root.type || null),
    props: { ...props, children },
    ...(state && { state })
  };
};
