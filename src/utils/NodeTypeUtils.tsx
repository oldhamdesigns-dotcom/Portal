import { ComponentType, MemoExoticComponent } from 'react';
import NodeTypeListPage from '@pages/generated/NodeTypeListPage';
import DotIcon from '@icons/node-type/DotIcon';
import BuildingsIcon from '@icons/node-type/BuildingsIcon';
import BuildingIcon from '@icons/node-type/BuildingIcon';
import UnitIcon from '@icons/node-type/UnitIcon';
import ResidentIcon from '@icons/node-type/ResidentIcon';
import ConfigurationIcon from '@icons/node-type/ConfigurationIcon';
import DeviceIcon from '@icons/node-type/DeviceIcon';
import LocationIcon from '@icons/node-type/LocationIcon';
import ChargeIcon from '@icons/node-type/ChargeIcon';
import MobileIcon from '@icons/node-type/MobileIcon';
import ReportIcon from '@icons/node-type/ReportIcon';
import { NavigationRoute } from '@/types/navigation-route';
import routes from '@/navigation/routes.json';

export const nodeIconToIcon = (
  icon?: { name: string; color: string; size: number },
  active = false
) => {
  if (!icon) {
    return () => null;
  }
  let Icon: MemoExoticComponent<ComponentType<IconProps>> | undefined;
  switch (icon?.name) {
    case 'Dot':
      Icon = DotIcon;
      break;
    case 'Buildings':
      Icon = BuildingsIcon;
      break;
    case 'Building':
      Icon = BuildingIcon;
      break;
    case 'Collection':
      Icon = UnitIcon;
      break;
    case 'PersonRolodex':
      Icon = ResidentIcon;
      break;
    case 'Gear':
      Icon = ConfigurationIcon;
      break;
    case 'DatabaseGear':
      Icon = DeviceIcon;
      break;
    case 'GeoAlt':
      Icon = LocationIcon;
      break;
    case 'ReceiptCutoff':
      Icon = ChargeIcon;
      break;
    case 'Phone':
      Icon = MobileIcon;
      break;
    case 'GraphUpArrow':
      Icon = ReportIcon;
      break;
    default:
      break;
  }
  return () =>
    Icon ? (
      <Icon
        width={icon?.size}
        height={icon?.size}
        fill={active ? icon?.color : undefined}
      />
    ) : null;
};

export const nodeTypesToRoute = (array: any[] | NodeTypeMenu[]): NavigationRoute[] => {
  return array.map((item) => ({
    path: item.path,
    title: item.title,
    labels: [item?.label, item?.secondLabel].filter((item) => item),
    Icon: ({ active = false }: { active?: boolean }) => nodeIconToIcon(item?.icon, active)(),
    Component: () => <NodeTypeListPage item={item} />,
    breadcrumbs: [
      { path: routes.MAIN_DASHBOARD, title: 'Home' },
      { path: routes.NODE_TYPES, title: 'Node types' },
      { path: item.path, title: item.title },
    ],
  }));
};
