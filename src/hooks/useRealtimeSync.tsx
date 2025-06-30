
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface RealtimeHookOptions {
  entityType: 'project' | 'task' | 'company';
  entityId: string;
  onUpdate?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface OptimisticUpdate<T> {
  id: string;
  data: T;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export const useRealtimeSync = <T,>(options: RealtimeHookOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [optimisticUpdates, setOptimisticUpdates] = useState<OptimisticUpdate<T>[]>([]);
  const { toast } = useToast();

  // Simular conexão WebSocket/Socket.io
  useEffect(() => {
    console.log(`🔗 Conectando ao canal: ${options.entityType}-${options.entityId}`);
    setIsConnected(true);

    // Simular recebimento de atualizações em tempo real
    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance de receber atualização
        const mockUpdate = {
          id: Date.now().toString(),
          type: options.entityType,
          data: { lastModified: new Date().toISOString() },
          user: 'Outro usuário'
        };
        
        options.onUpdate?.(mockUpdate);
        
        toast({
          title: "Atualização recebida",
          description: `${mockUpdate.user} fez alterações`,
        });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
      console.log(`🔌 Desconectado do canal: ${options.entityType}-${options.entityId}`);
    };
  }, [options.entityType, options.entityId]);

  // Atualização otimística
  const optimisticUpdate = useCallback(async (data: T, serverUpdate: () => Promise<T>) => {
    const updateId = Date.now().toString();
    
    // 1. Aplicar atualização imediatamente na UI
    const optimisticData: OptimisticUpdate<T> = {
      id: updateId,
      data,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    setOptimisticUpdates(prev => [...prev, optimisticData]);
    
    try {
      // 2. Enviar para o servidor
      const serverResponse = await serverUpdate();
      
      // 3. Confirmar sucesso
      setOptimisticUpdates(prev => 
        prev.map(update => 
          update.id === updateId 
            ? { ...update, status: 'confirmed' as const, data: serverResponse }
            : update
        )
      );
      
      // Limpar atualizações confirmadas após um tempo
      setTimeout(() => {
        setOptimisticUpdates(prev => prev.filter(u => u.id !== updateId));
      }, 1000);
      
    } catch (error) {
      // 4. Reverter em caso de erro
      setOptimisticUpdates(prev => 
        prev.map(update => 
          update.id === updateId 
            ? { ...update, status: 'failed' as const }
            : update
        )
      );
      
      toast({
        title: "Erro ao sincronizar",
        description: "Suas alterações foram revertidas. Tente novamente.",
        variant: "destructive"
      });
      
      options.onError?.(error as Error);
      
      // Remover atualização falhada
      setTimeout(() => {
        setOptimisticUpdates(prev => prev.filter(u => u.id !== updateId));
      }, 3000);
    }
  }, [toast, options.onError]);

  return {
    isConnected,
    optimisticUpdate,
    pendingUpdates: optimisticUpdates.filter(u => u.status === 'pending'),
    failedUpdates: optimisticUpdates.filter(u => u.status === 'failed')
  };
};

// Hook para verificação de permissões em tempo real
export const usePermissions = (companyId: string, userId: string = 'current-user') => {
  const [permissions, setPermissions] = useState({
    canCreateProjects: true,
    canEditProjects: true,
    canDeleteProjects: false,
    canInviteMembers: true,
    canManageCompany: true,
    role: 'admin' as 'admin' | 'member' | 'viewer'
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de permissões
    const loadPermissions = async () => {
      setIsLoading(true);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simular permissões baseadas no papel do usuário
      const mockPermissions = {
        canCreateProjects: true,
        canEditProjects: true,
        canDeleteProjects: true, // Admin pode deletar
        canInviteMembers: true,
        canManageCompany: true,
        role: 'admin' as const
      };
      
      setPermissions(mockPermissions);
      setIsLoading(false);
    };

    loadPermissions();
  }, [companyId, userId]);

  const hasPermission = useCallback((action: keyof typeof permissions) => {
    return permissions[action] === true;
  }, [permissions]);

  return {
    permissions,
    isLoading,
    hasPermission,
    role: permissions.role
  };
};
