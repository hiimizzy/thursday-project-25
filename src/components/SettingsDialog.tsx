
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Upload, User, Moon, Sun } from 'lucide-react';

interface SettingsDialogProps {
  trigger?: React.ReactNode;
}

const SettingsDialog = ({ trigger }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [accountUrl, setAccountUrl] = useState('minha-empresa');
  const [profileImage, setProfileImage] = useState('');

  const handleSave = () => {
    // Implementar lógica para salvar configurações
    console.log('Salvando configurações:', { darkMode, accountUrl, profileImage });
    
    // Aplicar modo escuro
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurações da Conta</DialogTitle>
          <DialogDescription>
            Personalize sua experiência no Thursday
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Foto de Perfil */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Foto de Perfil</label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profileImage} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('profile-image')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Alterar Foto
                </Button>
              </div>
            </div>
          </div>

          {/* URL da Conta */}
          <div className="space-y-2">
            <label className="text-sm font-medium">URL da Conta</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">thursday.com/</span>
              <Input
                value={accountUrl}
                onChange={(e) => setAccountUrl(e.target.value)}
                placeholder="minha-empresa"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Esta será a URL personalizada da sua empresa
            </p>
          </div>

          {/* Modo Escuro */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Modo Escuro</label>
              <p className="text-xs text-gray-500">
                Ativa o tema escuro em toda a aplicação
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <Moon className="h-4 w-4 text-blue-500" />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
