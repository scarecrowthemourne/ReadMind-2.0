import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface AddBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBook: (book: {
    title: string;
    author: string;
    totalPages: number;
    currentPage: number;
    coverUrl?: string;
    genre?: string;
    notes?: string;
  }) => void;
}

export function AddBookDialog({ open, onOpenChange, onAddBook }: AddBookDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    currentPage: '0',
    coverUrl: '',
    genre: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.totalPages) {
      return;
    }

    onAddBook({
      title: formData.title,
      author: formData.author,
      totalPages: parseInt(formData.totalPages),
      currentPage: parseInt(formData.currentPage) || 0,
      coverUrl: formData.coverUrl || undefined,
      genre: formData.genre || undefined,
      notes: formData.notes || undefined,
    });

    // Reset form
    setFormData({
      title: '',
      author: '',
      totalPages: '',
      currentPage: '0',
      coverUrl: '',
      genre: '',
      notes: '',
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить книгу</DialogTitle>
          <DialogDescription>
            Заполните информацию о книге, которую хотите добавить в библиотеку
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Название *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Название книги"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author">Автор *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Имя автора"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="totalPages">Всего страниц *</Label>
                <Input
                  id="totalPages"
                  type="number"
                  min="1"
                  value={formData.totalPages}
                  onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
                  placeholder="300"
                  required
                />
              </div>
              <div className="grid gap-2">
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
            <div className="grid gap-2">
              <Label htmlFor="genre">Жанр</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                placeholder="Фантастика, Детектив..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="coverUrl">URL обложки</Label>
              <Input
                id="coverUrl"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Заметки</Label>
              <Textarea
                id="notes"
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
            <Button type="submit">Добавить книгу</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
