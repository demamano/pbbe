import { Role } from '@prisma/client';

// export enum Role {
//   Admin = 'Admin',
// }

export class Admin {
  id: string;
  username: string;
  hashedPassword: string;
  refreshToken?: string;
  role: Role;
}
