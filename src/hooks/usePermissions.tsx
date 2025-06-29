
import { useMemo } from 'react';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  role: UserRole;
  companyId: string;
}

export const usePermissions = (user: User) => {
  const permissions = useMemo(() => {
    const canEdit = user.role === 'admin' || user.role === 'editor';
    const canDelete = user.role === 'admin';
    const canInvite = user.role === 'admin';
    const canManageProject = user.role === 'admin';
    const canCreateColumns = canEdit;
    const canDeleteColumns = user.role === 'admin';

    return {
      canEdit,
      canDelete,
      canInvite,
      canManageProject,
      canCreateColumns,
      canDeleteColumns,
      canView: true // todos podem visualizar
    };
  }, [user.role]);

  return permissions;
};
