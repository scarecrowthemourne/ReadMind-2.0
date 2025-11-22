import { useState } from 'react';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Book } from '../App';
import { ProgressUpdate } from './ProgressUpdate';
import { NotesList } from './NotesList';
import { EditBookDialog } from './EditBookDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface BookDetailProps {
  book: Book;
  onBack: () => void;
  onUpdateProgress: (bookId: string, currentPage: number) => void;
  onAddNote: (bookId: string, noteText: string, page: number) => void;
  onDeleteNote: (bookId: string, noteId: string) => void;
  onDeleteBook: (bookId: string) => void;
  onUpdateBook: (book: Book) => void;
}

const statusConfig = {
  reading: { label: 'Читаю', color: 'bg-blue-500' },
  finished: { label: 'Прочитано', color: 'bg-green-500' },
  planned: { label: 'Планирую', color: 'bg-slate-500' },
};

export function BookDetail({ 
  book, 
  onBack, 
  onUpdateProgress, 
  onAddNote, 
  onDeleteNote,
  onDeleteBook,
  onUpdateBook
}: BookDetailProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const progress = Math.round((book.currentPage / book.totalPages) * 100);
  const status = statusConfig[book.status];
  const pagesLeft = book.totalPages - book.currentPage;

  const handleDelete = () => {
    onDeleteBook(book.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Назад к библиотеке
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)} className="gap-2">
            <Edit className="w-4 h-4" />
            Редактировать
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsDeleteDialogOpen(true)} className="gap-2 text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
            Удалить
          </Button>
        </div>
      </div>

      {/* Book Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-slate-900 mb-2">{book.title}</h2>
              <p className="text-slate-600 mb-4">{book.author}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className={`${status.color} text-white`}>
                  {status.label}
                </Badge>
                <Badge variant="outline">{book.genre}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Прогресс чтения</span>
              <span className="text-slate-900">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-slate-600">
              <span>Прочитано: {book.currentPage} стр.</span>
              <span>Осталось: {pagesLeft} стр.</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div className="text-center">
              <div className="text-slate-900">{book.totalPages}</div>
              <div className="text-slate-500">Всего страниц</div>
            </div>
            <div className="text-center">
              <div className="text-slate-900">{book.notes.length}</div>
              <div className="text-slate-500">Заметок</div>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-slate-900">
                {new Date(book.dateAdded).toLocaleDateString('ru-RU')}
              </div>
              <div className="text-slate-500">Дата добавления</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Progress and Notes */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="progress">Обновить прогресс</TabsTrigger>
          <TabsTrigger value="notes">Заметки ({book.notes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <ProgressUpdate
            book={book}
            onUpdateProgress={onUpdateProgress}
          />
        </TabsContent>

        <TabsContent value="notes">
          <NotesList
            book={book}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <EditBookDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        book={book}
        onUpdateBook={onUpdateBook}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить книгу?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить книгу "{book.title}"? Это действие нельзя отменить. Все заметки также будут удалены.
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
