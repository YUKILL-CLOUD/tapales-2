import { deleteService } from '@/lib/action';
import { DeleteServiceModalClient } from './DeleteServiceModalClient';

export function DeleteServiceModal({ service }: { service: any }) {
  return <DeleteServiceModalClient deleteService={deleteService} service={service} />;
}