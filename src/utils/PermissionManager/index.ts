import {
  CheckPermissionsOptions,
  HasPermissionsOptions,
  LookupPermissionOptions,
  PermissionsMap,
  RefinePermissionsOptions,
} from './types';
import { PermissionTypes } from '../vars';
import { EmbeddedInstance, UserId } from '../../types';

export class PermissionManager {
  parent: EmbeddedInstance;

  permissionsMap: PermissionsMap = {};

  constructor(parent: EmbeddedInstance) {
    this.parent = parent;
  }

  lookupDynamicPermission = (
    permission: PermissionTypes,
    dynamicPermissions: PermissionTypes[] | undefined
  ) => {
    if (!dynamicPermissions) {
      return false;
    }

    return dynamicPermissions.includes(permission);
  };

  lookupPermission = (options: LookupPermissionOptions) => {
    const { permissionsMap, permission, targetRole, role, dynamicPermissions } = options;

    if (dynamicPermissions) {
      const granted = this.lookupDynamicPermission(permission, dynamicPermissions);
      if (granted) {
        return true;
      }
    }

    if (permissionsMap[role][permission]) {
      return true;
    }

    return Boolean(permissionsMap[role][`${permission}_${targetRole}`]);
  };
  checkPermissions = ({
    permissions,
    targetRole,
    permissionsMap,
    role,
    dynamicPermissions,
  }: CheckPermissionsOptions) => {
    if (Array.isArray(permissions)) {
      return permissions.some((permission) =>
        this.lookupPermission({ permission, targetRole, role, permissionsMap, dynamicPermissions })
      );
    }

    return this.lookupPermission({
      permission: permissions,
      targetRole,
      role,
      permissionsMap,
      dynamicPermissions,
    });
  };

  refinePermissions = (
    permissions: PermissionTypes | PermissionTypes[],
    { targetRole, role, userId, users, permissionsMap, localUser }: RefinePermissionsOptions
  ) => {
    const options: CheckPermissionsOptions = {
      permissionsMap,
      permissions,
      targetRole,
      role: localUser.role,
      dynamicPermissions: localUser.dynamicPermissions,
    };

    if (role) {
      options.role = role;
      options.dynamicPermissions = undefined;
    }

    if (userId && users) {
      options.role = users[userId].role;
      options.dynamicPermissions = users[userId].dynamicPermissions;
    }

    return this.checkPermissions(options);
  };

  hasPermissions = (
    permissions: PermissionTypes | PermissionTypes[],
    { targetRole, role, userId }: HasPermissionsOptions = {}
  ) => {
    const users = this.parent.stored.users;
    const localUser = this.parent.localUser;

    if (!localUser) {
      return false;
    }

    return this.refinePermissions(permissions, {
      permissionsMap: this.permissionsMap,
      role,
      targetRole,
      users,
      userId,
      localUser,
    });
  };
}
