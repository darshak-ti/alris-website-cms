import {
  IconAperture,
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Blog',
    icon: IconAperture,
    href: '/blogs',
  },
  {
    id: uniqueId(),
    title: 'Categories',
    icon: IconAperture,
    href: '/categories',
  },
  {
    id: uniqueId(),
    title: 'Pages',
    icon: IconAperture,
    href: '/pages',
  },
];

export default Menuitems;
