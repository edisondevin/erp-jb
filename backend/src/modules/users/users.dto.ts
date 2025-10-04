// backend/src/modules/users/users.dto.ts
import { z } from 'zod';

export const PaginationDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  isActive: z
    .union([z.string().transform(v => v === 'true'), z.boolean()])
    .optional(),
});

export const CreateUserDTO = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const UpdateUserDTO = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  isActive: z.boolean().optional(),
});

export const AssignRolesDTO = z.object({
  roleIds: z.array(z.number().int().positive()).min(0),
});

export type PaginationInput = z.infer<typeof PaginationDTO>;
export type CreateUserInput = z.infer<typeof CreateUserDTO>;
export type UpdateUserInput = z.infer<typeof UpdateUserDTO>;
export type AssignRolesInput = z.infer<typeof AssignRolesDTO>;
