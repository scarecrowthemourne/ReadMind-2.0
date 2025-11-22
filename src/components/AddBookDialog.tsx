import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Book } from '../App';

interface AddBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBook: (book: Omit<Book, 'id' | 'dateAdded' | 'notes'>) => void;
}

const popularGenres = [
  'Художественная литература',
  'Научная фантастика',
  'Фэнтези',
  'Детектив',
  'Триллер',
  'Романтика',
  'Историческая литература',
  'Биография',
  'Научно-популярная',
  'Психология',
  'Бизнес',
  'Саморазвитие',
  'Философия',
  'Классическая литература',
  'Другое',
];

export function AddBookDialog({ open, onOpenChange, onAddBook }: AddBookDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    totalPages: '',
    currentPage: '',
    status: 'planned' as 'reading' | 'finished' | 'planned',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.genre || !formData.totalPages) {
      return;
    }

    onAddBook({
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      totalPages: parseInt(formData.totalPages),
      currentPage: formData.currentPage ? parseInt(formData.currentPage) : 0,
      status: formData.status,
    });

    // Reset form
    setFormData({
      title: '',
      author: '',
      genre: '',
      totalPages: '',
      currentPage: '',
      status: 'planned',
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить книгу</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название книги *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите название"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Автор *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Введите имя автора"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Жанр *</Label>
            <Select
              value={formData.genre}
              onValueChange={(value) => setFormData({ ...formData, genre: value })}
            >
              <SelectTrigger id="genre">
                <SelectValue placeholder="Выберите жанр" />
              </SelectTrigger>
              <SelectContent>
                {popularGenres.map(genre => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalPages">Всего страниц *</Label>
              <Input
                id="totalPages"
                type="number"
                min="1"
                value={formData.totalPages}
                onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPage">Текущая страница</Label>
              <Input
                id="currentPage"
                type="number"
                min="0"
                value={formData.currentPage}
                onChange={(e) => setFormData({ ...formData, currentPage: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Статус *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as any })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Планирую</SelectItem>
                <SelectItem value="reading">Читаю</SelectItem>
                <SelectItem value="finished">Прочитано</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Добавить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
