import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Book } from '../App';

interface EditBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book;
  onUpdateBook: (book: Book) => void;
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

export function EditBookDialog({ open, onOpenChange, book, onUpdateBook }: EditBookDialogProps) {
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre,
    totalPages: book.totalPages.toString(),
    status: book.status,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        totalPages: book.totalPages.toString(),
        status: book.status,
      });
    }
  }, [open, book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.genre || !formData.totalPages) {
      return;
    }

    const updatedBook: Book = {
      ...book,
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      totalPages: parseInt(formData.totalPages),
      status: formData.status,
      currentPage: Math.min(book.currentPage, parseInt(formData.totalPages)),
    };

    onUpdateBook(updatedBook);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редактировать книгу</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Название книги *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите название"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-author">Автор *</Label>
            <Input
              id="edit-author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Введите имя автора"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-genre">Жанр *</Label>
            <Select
              value={formData.genre}
              onValueChange={(value) => setFormData({ ...formData, genre: value })}
            >
              <SelectTrigger id="edit-genre">
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

          <div className="space-y-2">
            <Label htmlFor="edit-totalPages">Всего страниц *</Label>
            <Input
              id="edit-totalPages"
              type="number"
              min="1"
              value={formData.totalPages}
              onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Статус *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as any })}
            >
              <SelectTrigger id="edit-status">
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
            <Button type="submit">Сохранить изменения</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
