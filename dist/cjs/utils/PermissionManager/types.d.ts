import { User, UserId } from '../../types';
import { PermissionTypes } from '../vars';
export type PermissionsMap = Record<string, Record<string, boolean>>;
export interface HasPermissionsOptions {
    targetRole?: string;
    role?: string;
    userId?: UserId;
}
export interface RefinePermissionsOptions extends HasPermissionsOptions {
    permissionsMap: PermissionsMap;
    localUser: User;
    users?: Record<UserId, User>;
}
export interface LookupPermissionOptions {
    permissionsMap: PermissionsMap;
    permission: PermissionTypes;
    role: string;
    targetRole?: string;
    dynamicPermissions?: PermissionTypes[];
}
export interface CheckPermissionsOptions extends Omit<LookupPermissionOptions, 'permission'> {
    permissions: PermissionTypes | PermissionTypes[];
}
