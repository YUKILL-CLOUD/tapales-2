import { updateService } from '@/lib/action';
import { EditServiceModalClient } from './EditServiceModalClient';

export function EditServiceModal({ service }: { service: any }) {
  return <EditServiceModalClient updateService={updateService} service={service} />;
}