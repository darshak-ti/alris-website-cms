import {
  IconAperture,
} from '@tabler/icons';
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Sample Page',
    icon: IconAperture,
    href: '/sample-page',
    chip: 'New',
    chipColor: 'secondary',
  }
];
export default Menuitems;
