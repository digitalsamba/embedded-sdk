import { CheckPermissionsOptions, HasPermissionsOptions, LookupPermissionOptions, PermissionsMap, RefinePermissionsOptions } from './types';
import { PermissionTypes } from '../vars';
import { EmbeddedInstance } from '../../types';
export declare class PermissionManager {
    parent: EmbeddedInstance;
    permissionsMap: PermissionsMap;
    constructor(parent: EmbeddedInstance);
    lookupDynamicPermission: (permission: PermissionTypes, dynamicPermissions: PermissionTypes[] | undefined) => boolean;
    lookupPermission: (options: LookupPermissionOptions) => boolean;
    checkPermissions: ({ permissions, targetRole, permissionsMap, role, dynamicPermissions, }: CheckPermissionsOptions) => boolean;
    refinePermissions: (permissions: PermissionTypes | PermissionTypes[], { targetRole, role, userId, users, permissionsMap, localUser }: RefinePermissionsOptions) => boolean;
    hasPermissions: (permissions: PermissionTypes | PermissionTypes[], { targetRole, role, userId }?: HasPermissionsOptions) => boolean;
}
