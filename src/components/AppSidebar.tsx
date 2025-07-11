
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FolderKanban, 
  Users, 
  LogOut,
  Plus,
  User,
  Building
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CreateProjectDialog from './CreateProjectDialog';
import InviteMembersDialog from './InviteMembersDialog';
import CompanySelector from './CompanySelector';
import { useIsTablet, useIsMobile } from '@/hooks/use-mobile';

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

interface AppSidebarProps {
  currentCompany: Company | null;
  profileImage: string;
  onProfileImageChange: (image: string) => void;
  projects: Project[];
  onCreateProject: (project: Project) => void;
  companies: Company[];
  onCompanyChange: (company: Company) => void;
  onCreateCompany: (name: string) => void;
}

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Projetos', url: '/dashboard', icon: FolderKanban },
];

export function AppSidebar({ 
  currentCompany, 
  profileImage, 
  onProfileImageChange, 
  projects, 
  onCreateProject,
  companies,
  onCompanyChange,
  onCreateCompany
}: AppSidebarProps) {
  const { state } = useSidebar();
  const isTablet = useIsTablet();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  
  // Tablet e mobile usam o mesmo comportamento (offcanvas)
  const isMobileOrTablet = isMobile || isTablet;
  const isCollapsed = state === 'collapsed' && !isMobileOrTablet;
  const showContent = !isCollapsed;
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar 
      className={isCollapsed ? "w-14" : "w-64"} 
      collapsible={isMobileOrTablet ? "offcanvas" : "icon"}
    >
      <SidebarHeader className="p-4">
        {showContent && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold text-blue-600">
                {isCollapsed ? 'T' : 'Thursday'}
              </div>
            </div>
            
            {!isCollapsed && (
              <CompanySelector
                companies={companies}
                currentCompany={currentCompany}
                onCompanyChange={onCompanyChange}
                onCreateCompany={onCreateCompany}
              />
            )}
            
            {isCollapsed && (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                  <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            )}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Navegação Principal */}
        <SidebarGroup>
          {showContent && <SidebarGroupLabel>Navegação</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <NavLink to={item.url} className="flex items-center">
                      <item.icon className="h-4 w-4" />
                      {showContent && !isCollapsed && (
                        <span className="ml-2">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Ações - Novo Projeto */}
        <SidebarGroup>
          {showContent && <SidebarGroupLabel>Ações</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setIsCreateProjectOpen(true)}
                  tooltip={isCollapsed ? "Novo Projeto" : undefined}
                >
                  <Plus className="h-4 w-4" />
                  {showContent && !isCollapsed && (
                    <span className="ml-2">Novo Projeto</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setIsInviteOpen(true)}
                  tooltip={isCollapsed ? "Convidar Membros" : undefined}
                >
                  <Users className="h-4 w-4" />
                  {showContent && !isCollapsed && (
                    <span className="ml-2">Convidar Membros</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Projetos Recentes */}
        <SidebarGroup>
          {showContent && <SidebarGroupLabel>Projetos Recentes</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.slice(0, 3).map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={isCollapsed ? project.name : undefined}
                  >
                    <NavLink 
                      to={`/project/${project.id}`}
                      className="flex items-center"
                    >
                      <FolderKanban className="h-4 w-4" />
                      {showContent && !isCollapsed && (
                        <span className="ml-2 truncate">{project.name}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          {/* Perfil do Usuário */}
          {showContent && !isCollapsed && (
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileImage} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">Usuário</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentCompany?.role || 'Membro'}
                </div>
              </div>
            </div>
          )}

          {/* Botão Sair - Sempre Visível */}
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "sm"}
            onClick={() => navigate('/')}
            className={`w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors ${
              isCollapsed ? 'justify-center p-2' : ''
            }`}
            title={isCollapsed ? "Sair" : undefined}
          >
            <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
            {!isCollapsed && 'Sair'}
          </Button>
        </div>
      </SidebarFooter>

      {/* Diálogos */}
      <CreateProjectDialog 
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
        onCreateProject={onCreateProject}
      />
      
      <InviteMembersDialog 
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
      />
    </Sidebar>
  );
}
