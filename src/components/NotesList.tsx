import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Book } from '../App';
import { StickyNote, Trash2, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface NotesListProps {
  book: Book;
  onAddNote: (bookId: string, noteText: string, page: number) => void;
  onDeleteNote: (bookId: string, noteId: string) => void;
}

export function NotesList({ book, onAddNote, onDeleteNote }: NotesListProps) {
  const [noteText, setNoteText] = useState('');
  const [notePage, setNotePage] = useState(book.currentPage);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    onAddNote(book.id, noteText, notePage);
    setNoteText('');
    setNotePage(book.currentPage);
    setIsAddingNote(false);
  };

  const handleDelete = () => {
    if (deleteNoteId) {
      onDeleteNote(book.id, deleteNoteId);
      setDeleteNoteId(null);
    }
  };

  const sortedNotes = [...book.notes].sort((a, b) => b.page - a.page);

  return (
    <div className="space-y-4">
      {/* Add Note Form */}
      {isAddingNote ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Добавить заметку
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notePage">Номер страницы</Label>
                <Input
                  id="notePage"
                  type="number"
                  min="0"
                  max={book.totalPages}
                  value={notePage}
                  onChange={(e) => setNotePage(parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="noteText">Текст заметки</Label>
                <Textarea
                  id="noteText"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Введите вашу заметку или цитату..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Сохранить заметку
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingNote(false);
                    setNoteText('');
                    setNotePage(book.currentPage);
                  }}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAddingNote(true)} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Добавить заметку
        </Button>
      )}

      {/* Notes List */}
      {sortedNotes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            <StickyNote className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Заметки отсутствуют</p>
            <p className="text-slate-400">Добавьте свою первую заметку к этой книге</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedNotes.map((note) => (
            <Card key={note.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-slate-600">
                      <StickyNote className="w-4 h-4" />
                      <span>Страница {note.page}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-400">
                        {new Date(note.date).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-slate-900 whitespace-pre-wrap">{note.text}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteNoteId(note.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteNoteId} onOpenChange={(open) => !open && setDeleteNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить заметку?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить эту заметку? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
