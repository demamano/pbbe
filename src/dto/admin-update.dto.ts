import { Role } from '@prisma/client';
export class UpdateAdminDto {
  username: string;
  password: string;
  role: Role;
  refreshToken?: string;
}
