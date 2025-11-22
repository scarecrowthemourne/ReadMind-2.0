import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  coverUrl?: string;
  genre?: string;
  notes?: string;
  status: 'reading' | 'completed' | 'to-read';
  createdAt: string;
  userId: string;
}

interface EditBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  onUpdateBook: (bookId: string, updates: Partial<Book>) => void;
}

export function EditBookDialog({ open, onOpenChange, book, onUpdateBook }: EditBookDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    genre: '',
    coverUrl: '',
    notes: '',
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        totalPages: book.totalPages.toString(),
        genre: book.genre || '',
        coverUrl: book.coverUrl || '',
        notes: book.notes || '',
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!book || !formData.title || !formData.author || !formData.totalPages) {
      return;
    }

    onUpdateBook(book.id, {
      title: formData.title,
      author: formData.author,
      totalPages: parseInt(formData.totalPages),
      genre: formData.genre || undefined,
      coverUrl: formData.coverUrl || undefined,
      notes: formData.notes || undefined,
    });
    
    onOpenChange(false);
  };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редактировать книгу</DialogTitle>
          <DialogDescription>
            Измените информацию о книге
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Название *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Название книги"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-author">Автор *</Label>
              <Input
                id="edit-author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Имя автора"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-totalPages">Всего страниц *</Label>
              <Input
                id="edit-totalPages"
                type="number"
                min="1"
                value={formData.totalPages}
                onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
                placeholder="300"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-genre">Жанр</Label>
              <Input
                id="edit-genre"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                placeholder="Фантастика, Детектив..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-coverUrl">URL обложки</Label>
              <Input
                id="edit-coverUrl"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Заметки</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ваши мысли о книге..."
                rows={3}
              />
            </div>
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
