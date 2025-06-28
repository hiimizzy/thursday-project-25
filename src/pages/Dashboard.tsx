
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Star, Users, Calendar, BarChart3, Settings, LogOut, User, Help } from 'lucide-react';
import CreateProjectDialog from '@/components/CreateProjectDialog';
import SettingsDialog from '@/components/SettingsDialog';
import CompanySelector from '@/components/CompanySelector';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  members: number;
  tasks: number;
  completedTasks: number;
  dueDate: string;
  favorite: boolean;
}

interface Company {
  id: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([
    { id: '1', name: 'Minha Empresa', role: 'admin' },
    { id: '2', name: 'Empresa Cliente', role: 'member' }
  ]);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Redesign completo do site da empresa',
      status: 'active',
      members: 5,
      tasks: 24,
      completedTasks: 12,
      dueDate: '2024-07-15',
      favorite: true
    },
    {
      id: '2',
      name: 'App Mobile',
      description: 'Desenvolvimento do aplicativo móvel',
      status: 'active',
      members: 3,
      tasks: 18,
      completedTasks: 6,
      dueDate: '2024-08-20',
      favorite: false
    }
  ]);

  useEffect(() => {
    // Carregar foto de perfil salva
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    // Definir empresa padrão
    if (companies.length > 0 && !currentCompany) {
      setCurrentCompany(companies[0]);
    }
  }, [companies, currentCompany]);

  const handleCreateProject = (newProject: Project) => {
    setProjects([...projects, newProject]);
  };

  const handleCompanyChange = (company: Company) => {
    setCurrentCompany(company);
    // Aqui você carregaria os projetos da empresa selecionada
    console.log('Mudando para empresa:', company.name);
  };

  const handleCreateCompany = (name: string) => {
    const newCompany: Company = {
      id: Date.now().toString(),
      name,
      role: 'admin'
    };
    setCompanies([...companies, newCompany]);
    setCurrentCompany(newCompany);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'completed': return 'Concluído';
      case 'paused': return 'Pausado';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">Thursday</h1>
            <CompanySelector
              companies={companies}
              currentCompany={currentCompany}
              onCompanyChange={handleCompanyChange}
              onCreateCompany={handleCreateCompany}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Help className="h-4 w-4 mr-2" />
              Ajuda
            </Button>
            
            <SettingsDialog
              currentProfileImage={profileImage}
              onProfileImageChange={setProfileImage}
              trigger={
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              }
            />
            
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={profileImage} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard - {currentCompany?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Gerencie seus projetos e colabore com sua equipe
              </p>
            </div>
            <CreateProjectDialog onCreateProject={handleCreateProject} />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.reduce((acc, p) => acc + p.members, 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.reduce((acc, p) => acc + p.completedTasks, 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((projects.reduce((acc, p) => acc + p.completedTasks, 0) / 
                    Math.max(projects.reduce((acc, p) => acc + p.tasks, 0), 1)) * 100)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    {project.favorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Vence: {new Date(project.dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {project.members} membros
                      </span>
                      <span>
                        {project.completedTasks}/{project.tasks} tarefas
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(project.completedTasks / Math.max(project.tasks, 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando seu primeiro projeto'}
              </p>
              {!searchTerm && <CreateProjectDialog onCreateProject={handleCreateProject} />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
