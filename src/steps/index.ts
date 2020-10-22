import { accessSteps } from './access';
import { accountSteps } from './account';
import { devicesSteps } from './devices';

const integrationSteps = [...accountSteps, ...accessSteps, ...devicesSteps];

export { integrationSteps };
