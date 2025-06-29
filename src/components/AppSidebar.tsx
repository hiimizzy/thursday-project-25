
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FolderKanban, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  Plus,
  BarChart3,
  User
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
import SettingsDialog from './SettingsDialog';
import HelpDialog from './HelpDialog';
import InviteMembersDialog from './InviteMembersDialog';

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

interface AppSidebarProps {
  currentCompany: { id: string; name: string; role: string } | null;
  profileImage: string;
  onProfileImageChange: (image: string) => void;
  projects: Project[];
  onCreateProject: (project: Project) => void;
}

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Projetos', url: '/dashboard', icon: FolderKanban },
  { title: 'Relatórios', url: '/reports', icon: BarChart3 },
];

export function AppSidebar({ 
  currentCompany, 
  profileImage, 
  onProfileImageChange, 
  projects, 
  onCreateProject 
}: AppSidebarProps) {
  const { state, isMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  
  const isCollapsed = state === 'collapsed' && !isMobile;
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar 
      className={isCollapsed ? "w-14" : "w-64"} 
      collapsible={isMobile ? "offcanvas" : "icon"}
    >
      <SidebarHeader className="p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="text-xl font-bold text-blue-600">Thursday</div>
            {currentCompany && (
              <div className="text-sm text-gray-600 truncate">
                {currentCompany.name}
              </div>
            )}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Navegação Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
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
                      {!isCollapsed && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Projetos Recentes */}
        <SidebarGroup>
          <SidebarGroupLabel>Projetos Recentes</SidebarGroupLabel>
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
                      {!isCollapsed && (
                        <span className="ml-2 truncate">{project.name}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Ações Rápidas */}
        <SidebarGroup>
          <SidebarGroupLabel>Ações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={isCollapsed ? "Novo Projeto" : undefined}
                  onClick={() => setIsCreateProjectOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">Novo Projeto</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={isCollapsed ? "Convidar Membros" : undefined}
                  onClick={() => setIsInviteOpen(true)}
                >
                  <Users className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">Convidar Membros</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          {/* Perfil do Usuário */}
          {!isCollapsed && (
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileImage} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">Usuário</div>
                <div className="text-xs text-gray-500 truncate">
                  {currentCompany?.role || 'Membro'}
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1"
              title="Ajuda"
              onClick={() => setIsHelpOpen(true)}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1"
              title="Configurações"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex-1 text-red-600 hover:text-red-700"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
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
      
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        currentProfileImage={profileImage}
        onProfileImageChange={onProfileImageChange}
      />
      
      <HelpDialog 
        open={isHelpOpen}
        onOpenChange={setIsHelpOpen}
      />
    </Sidebar>
  );
}
