import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  text: string;
  page?: number;
  createdAt: string;
}

interface NotesListProps {
  notes: Note[];
  onAddNote: (text: string, page?: number) => void;
  onDeleteNote: (noteId: string) => void;
}

export function NotesList({ notes, onAddNote, onDeleteNote }: NotesListProps) {
  const [newNote, setNewNote] = useState('');
  const [notePage, setNotePage] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      const page = notePage ? parseInt(notePage) : undefined;
      onAddNote(newNote.trim(), page);
      setNewNote('');
      setNotePage('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Добавьте заметку о книге..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Страница (необязательно)"
            value={notePage}
            onChange={(e) => setNotePage(e.target.value)}
            className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button onClick={handleAddNote} className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Добавить заметку
          </Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          Заметок пока нет. Добавьте первую заметку!
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="whitespace-pre-wrap">{note.text}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {note.page && <span>Стр. {note.page}</span>}
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteNote(note.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
