import { ComponentType, MemoExoticComponent } from 'react';

type NavigationRoute = {
  path: string;
  title?: string;
  labels: string[];
  Component?: MemoExoticComponent<ComponentType<any>> | ComponentType<any>;
  Icon?:
    | MemoExoticComponent<ComponentType<IconProps & { active?: boolean }>>
    | ComponentType<
        IconProps & {
          active?: boolean;
        }
      >;
  breadcrumbs?: Breadcrumbs[];
};
