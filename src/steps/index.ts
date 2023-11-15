import { accessSteps } from './access';
import { accountSteps } from './account';
import { devicesSteps } from './devices';
import { profileSteps } from './profiles';

const integrationSteps = [
  ...accountSteps,
  ...accessSteps,
  ...devicesSteps,
  ...profileSteps,
];

export { integrationSteps };
