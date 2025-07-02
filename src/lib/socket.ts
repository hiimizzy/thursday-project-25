
import { io, Socket } from 'socket.io-client';

// Configuração do Socket.io
const SOCKET_URL = 'ws://localhost:3001'; // Substitua pela URL do seu servidor

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    socket.on('connect', () => {
      console.log('🔌 Conectado ao Socket.io');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Desconectado do Socket.io');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão Socket.io:', error);
    });
  }
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// API mock para substituir o Supabase
export const mockAPI = {
  // Simula dados de empresas
  companies: [
    { id: '1', name: 'Minha Empresa', role: 'admin' as const },
    { id: '2', name: 'Empresa Teste', role: 'member' as const }
  ],

  // Simula dados de projetos
  projects: [
    {
      id: '1',
      name: 'Projeto Exemplo',
      description: 'Descrição do projeto exemplo',
      status: 'active' as const,
      members: 3,
      tasks: 12,
      completedTasks: 8,
      dueDate: '2024-12-31',
      favorite: true,
      companyId: '1',
      columns: [
        { id: '1', name: 'Nome', type: 'text' as const, width: 200 },
        { id: '2', name: 'Status', type: 'status' as const, width: 150, options: ['Pendente', 'Em Progresso', 'Concluído'] }
      ],
      items: [
        { id: '1', '1': 'Tarefa 1', '2': 'Em Progresso' },
        { id: '2', '1': 'Tarefa 2', '2': 'Pendente' }
      ]
    }
  ],

  // Simula usuário logado
  user: {
    id: '1',
    email: 'usuario@exemplo.com',
    name: 'Usuário Exemplo'
  }
};
