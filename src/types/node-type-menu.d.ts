type NodeTypeMenu = {
  path: string;
  nodeTypeId: number;
  payload: any;
  ui: any;
  component: string;
  label: string;
  title: string;
  icon: NodeTypeMenuIcon;
  columns: string[];
  state: {
    breadcrumbs: {
      title: string;
      page: string;
    }[];
  };
};
