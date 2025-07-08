import {  IconMap,IconClipboardText, IconArticle, IconUsers  } from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Blog',
    icon: IconArticle,
    href: '/blogs',
  },
  {
    id: uniqueId(),
    title: 'Sitemaps',
    icon: IconMap,
    href: '/sitemaps',
  },
  {
    id: uniqueId(),
    title: 'Pages',
    icon: IconClipboardText,
    href: '/pages',
  },
  {
    id: uniqueId(),
    title: 'Author',
    icon: IconUsers,
    href: '/author',
  },
];

export default Menuitems;
