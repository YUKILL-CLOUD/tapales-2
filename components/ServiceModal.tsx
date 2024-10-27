import { createService } from '@/lib/action';
import { ServiceModalClient } from './ServiceModalClient';

export function ServiceModal() {
  return <ServiceModalClient createService={createService} />;
}