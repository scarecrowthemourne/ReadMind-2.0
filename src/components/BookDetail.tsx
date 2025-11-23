import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Book as BookIcon, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProgressUpdate } from './ProgressUpdate';
import { NotesList } from './NotesList';
import type { Book } from './EditBookDialog';

interface Note {
  id: string;
  text: string;
  page?: number;
  createdAt: string;
  bookId: string;
}

interface BookDetailProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateProgress: (bookId: string, currentPage: number) => void;
  onMarkAsCompleted: (bookId: string) => void;
  notes: Note[];
  onAddNote: (bookId: string, text: string, page?: number) => void;
  onDeleteNote: (noteId: string) => void;
}

export function BookDetail({
  book,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onUpdateProgress,
  onMarkAsCompleted,
  notes,
  onAddNote,
  onDeleteNote,
}: BookDetailProps) {
  if (!book) return null;

  const bookNotes = notes.filter(note => note.bookId === book.id);
  const isCompleted = book.status === 'completed';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Детали книги</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Cover and Basic Info */}
          <div className="flex gap-4">
            <div className="w-32 aspect-[2/3] rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {book.coverUrl ? (
                <ImageWithFallback
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookIcon className="w-12 h-12 text-muted-foreground/20" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <h2>{book.title}</h2>
              <p className="text-muted-foreground">{book.author}</p>
              {book.genre && (
                <Badge variant="secondary">{book.genre}</Badge>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
                <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="progress">Прогресс</TabsTrigger>
              <TabsTrigger value="notes">Заметки ({bookNotes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4">
              <ProgressUpdate book={book} onUpdateProgress={onUpdateProgress} />
              
              {!isCompleted && book.currentPage >= book.totalPages && (
                <Button 
                  onClick={() => onMarkAsCompleted(book.id)} 
                  className="w-full"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Отметить как прочитанную
                </Button>
              )}

              {book.notes && (
                <div className="pt-4 border-t">
                  <h4 className="mb-2">Общие заметки</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {book.notes}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes">
              <NotesList
                notes={bookNotes}
                onAddNote={(text, page) => onAddNote(book.id, text, page)}
                onDeleteNote={onDeleteNote}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
