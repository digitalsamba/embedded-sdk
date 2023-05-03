"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionManager = void 0;
class PermissionManager {
    constructor(parent) {
        this.permissionsMap = {};
        this.lookupDynamicPermission = (permission, dynamicPermissions) => {
            if (!dynamicPermissions) {
                return false;
            }
            return dynamicPermissions.includes(permission);
        };
        this.lookupPermission = (options) => {
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
        this.checkPermissions = ({ permissions, targetRole, permissionsMap, role, dynamicPermissions, }) => {
            if (Array.isArray(permissions)) {
                return permissions.some((permission) => this.lookupPermission({ permission, targetRole, role, permissionsMap, dynamicPermissions }));
            }
            return this.lookupPermission({
                permission: permissions,
                targetRole,
                role,
                permissionsMap,
                dynamicPermissions,
            });
        };
        this.refinePermissions = (permissions, { targetRole, role, userId, users, permissionsMap, localUser }) => {
            const options = {
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
        this.hasPermissions = (permissions, { targetRole, role, userId } = {}) => {
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
        this.parent = parent;
    }
}
exports.PermissionManager = PermissionManager;
