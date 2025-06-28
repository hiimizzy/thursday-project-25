
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Settings2, Trash2, GripVertical, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Column {
  id: string;
  name: string;
  type: 'text' | 'number' | 'status' | 'date' | 'dropdown' | 'person' | 'checkbox';
  width: number;
  options?: string[];
}

interface Item {
  id: string;
  [key: string]: any;
}

interface BoardViewProps {
  project: any;
  onUpdateProject: (updatedProject: any) => void;
}

const BoardView = ({ project, onUpdateProject }: BoardViewProps) => {
  const [columns, setColumns] = useState<Column[]>(project.columns || []);
  const [items, setItems] = useState<Item[]>(project.items || []);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<Column['type']>('text');

  const addColumn = () => {
    if (newColumnName.trim()) {
      const newColumn: Column = {
        id: Date.now().toString(),
        name: newColumnName,
        type: newColumnType,
        width: 150,
        options: newColumnType === 'status' ? ['Opção 1', 'Opção 2', 'Opção 3'] : 
                newColumnType === 'dropdown' ? ['Opção A', 'Opção B', 'Opção C'] : undefined
      };
      const updatedColumns = [...columns, newColumn];
      setColumns(updatedColumns);
      updateProject({ columns: updatedColumns });
      setNewColumnName('');
      setNewColumnType('text');
      setShowAddColumn(false);
    }
  };

  const addItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      [columns[0]?.id || '1']: `Item ${items.length + 1}`
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    updateProject({ items: updatedItems, tasks: updatedItems.length });
  };

  const updateItem = (itemId: string, columnId: string, value: any) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, [columnId]: value } : item
    );
    setItems(updatedItems);
    updateProject({ items: updatedItems });
  };

  const deleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    updateProject({ items: updatedItems, tasks: updatedItems.length });
  };

  const updateProject = (updates: any) => {
    const updatedProject = { ...project, ...updates };
    onUpdateProject(updatedProject);
  };

  const renderCellContent = (item: Item, column: Column) => {
    const value = item[column.id];

    switch (column.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => updateItem(item.id, column.id, e.target.value)}
            className="border-0 bg-transparent"
            placeholder="Digite aqui..."
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => updateItem(item.id, column.id, e.target.value)}
            className="border-0 bg-transparent"
            placeholder="0"
          />
        );
      
      case 'status':
        return (
          <Select value={value || ''} onValueChange={(newValue) => updateItem(item.id, column.id, newValue)}>
            <SelectTrigger className="border-0 bg-transparent">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {column.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  <Badge variant="outline">{option}</Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'dropdown':
        return (
          <Select value={value || ''} onValueChange={(newValue) => updateItem(item.id, column.id, newValue)}>
            <SelectTrigger className="border-0 bg-transparent">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {column.options?.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="justify-start font-normal border-0 bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => updateItem(item.id, column.id, date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      
      case 'person':
        return (
          <Select value={value || ''} onValueChange={(newValue) => updateItem(item.id, column.id, newValue)}>
            <SelectTrigger className="border-0 bg-transparent">
              <SelectValue placeholder="Atribuir" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user1">João Silva</SelectItem>
              <SelectItem value="user2">Maria Santos</SelectItem>
              <SelectItem value="user3">Pedro Costa</SelectItem>
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <Checkbox
            checked={value || false}
            onCheckedChange={(checked) => updateItem(item.id, column.id, checked)}
          />
        );
      
      default:
        return <span>{value}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={addItem} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </Button>
          <Dialog open={showAddColumn} onOpenChange={setShowAddColumn}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nova Coluna
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Coluna</DialogTitle>
                <DialogDescription>
                  Configure o nome e tipo da nova coluna
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome da Coluna</label>
                  <Input
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="Digite o nome da coluna..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo da Coluna</label>
                  <Select value={newColumnType} onValueChange={(value: Column['type']) => setNewColumnType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="date">Data</SelectItem>
                      <SelectItem value="dropdown">Lista Suspensa</SelectItem>
                      <SelectItem value="person">Pessoa</SelectItem>
                      <SelectItem value="checkbox">Caixa de Seleção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addColumn} className="w-full bg-blue-600 hover:bg-blue-700">
                  Adicionar Coluna
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              {columns.map((column) => (
                <TableHead key={column.id} style={{ width: column.width }}>
                  <div className="flex items-center justify-between">
                    <span>{column.name}</span>
                    <Settings2 className="h-4 w-4 text-gray-400" />
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {renderCellContent(item, column)}
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">Nenhum item criado ainda</p>
          <Button onClick={addItem} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default BoardView;
