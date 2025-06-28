
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Users, 
  Settings, 
  LogOut, 
  Calendar, 
  Clock, 
  Target,
  ChevronDown,
  Mail,
  HelpCircle,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  Star,
  Layout,
  Kanban,
  Table,
  BarChart3
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  members: number;
  tasks: number;
  completedTasks: number;
  dueDate: string;
  view: 'kanban' | 'board' | 'calendar' | 'timeline' | 'cards';
  favorite: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentCompany, setCurrentCompany] = useState('Minha Empresa');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Projeto Marketing 2024',
      description: 'Campanhas e estratégias de marketing para o próximo ano',
      status: 'active',
      members: 5,
      tasks: 24,
      completedTasks: 18,
      dueDate: '2024-02-15',
      view: 'kanban',
      favorite: true
    },
    {
      id: '2',
      name: 'Desenvolvimento App Mobile',
      description: 'Criação do aplicativo móvel da empresa',
      status: 'active',
      members: 8,
      tasks: 45,
      completedTasks: 23,
      dueDate: '2024-03-30',
      view: 'board',
      favorite: false
    },
    {
      id: '3',
      name: 'Treinamento Equipe',
      description: 'Programa de capacitação para novos funcionários',
      status: 'completed',
      members: 12,
      tasks: 15,
      completedTasks: 15,
      dueDate: '2024-01-20',
      view: 'calendar',
      favorite: false
    }
  ]);

  const companies = [
    'Minha Empresa',
    'Startup Inovadora',
    'Tech Solutions'
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'completed': return 'Concluído';
      case 'paused': return 'Pausado';
      default: return status;
    }
  };

  const getViewIcon = (view: string) => {
    switch (view) {
      case 'kanban': return <Kanban className="h-4 w-4" />;
      case 'board': return <Table className="h-4 w-4" />;
      case 'calendar': return <Calendar className="h-4 w-4" />;
      case 'timeline': return <BarChart3 className="h-4 w-4" />;
      default: return <Layout className="h-4 w-4" />;
    }
  };

  const toggleFavorite = (projectId: string) => {
    setProjects(projects.map(project =>
      project.id === projectId
        ? { ...project, favorite: !project.favorite }
        : project
    ));
  };

  const handleInvite = () => {
    if (inviteEmail && inviteEmail.includes('@')) {
      // Simular envio de convite
      console.log(`Convite enviado para ${inviteEmail} como ${inviteRole}`);
      setInviteEmail('');
      setInviteRole('member');
      setShowInviteDialog(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const helpSteps = [
    "1. Clique em 'Novo Projeto' para criar seu primeiro projeto",
    "2. Escolha a visualização que preferir (Kanban, Quadro, etc.)",
    "3. Adicione tarefas e organize seu trabalho",
    "4. Convide membros da equipe através do botão 'Convidar'",
    "5. Use a barra de pesquisa para encontrar projetos rapidamente",
    "6. Marque projetos como favoritos clicando na estrela"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">Thursday</h1>
              
              {/* Company Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <span>{currentCompany}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {companies.map((company) => (
                    <DropdownMenuItem
                      key={company}
                      onClick={() => setCurrentCompany(company)}
                    >
                      {company}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Help Button */}
              <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Ajuda
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Como usar o Thursday</DialogTitle>
                    <DialogDescription>
                      Guia passo a passo para começar
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {helpSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{step.substring(2)}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Invite Button */}
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Users className="h-4 w-4 mr-2" />
                    Convidar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Convidar novo membro</DialogTitle>
                    <DialogDescription>
                      Adicione um novo membro à sua equipe
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Função</label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Membro</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleInvite} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Convite
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Meus Projetos</h2>
            <p className="text-gray-600">Gerencie todos os seus projetos em um só lugar</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
                <SelectItem value="paused">Pausados</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>{project.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(project.id);
                        }}
                        className="text-gray-400 hover:text-yellow-500"
                      >
                        <Star className={`h-4 w-4 ${project.favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </button>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {project.description}
                    </CardDescription>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                  <div className="flex items-center space-x-1 text-gray-500">
                    {getViewIcon(project.view)}
                    <span className="text-sm capitalize">{project.view}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium">{project.completedTasks}/{project.tasks} tarefas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(project.completedTasks / project.tasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{project.members} membros</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.dueDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto ainda'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Tente ajustar sua busca ou filtros'
                : 'Comece criando seu primeiro projeto'
              }
            </p>
            {!searchTerm && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
