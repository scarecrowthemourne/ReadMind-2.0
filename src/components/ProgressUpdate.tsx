import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Book } from '../App';
import { BookOpen, Plus, Minus } from 'lucide-react';

interface ProgressUpdateProps {
  book: Book;
  onUpdateProgress: (bookId: string, currentPage: number) => void;
}

export function ProgressUpdate({ book, onUpdateProgress }: ProgressUpdateProps) {
  const [currentPage, setCurrentPage] = useState(book.currentPage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProgress(book.id, currentPage);
  };

  const updatePage = (newPage: number) => {
    const validPage = Math.min(book.totalPages, Math.max(0, newPage));
    setCurrentPage(validPage);
  };

  const addPages = (pages: number) => {
    updatePage(currentPage + pages);
  };

  const progress = Math.round((currentPage / book.totalPages) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Обновление прогресса чтения
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Visual Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Прогресс</Label>
              <span className="text-slate-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-slate-500">
              <span>{currentPage} стр.</span>
              <span>{book.totalPages} стр.</span>
            </div>
          </div>

          {/* Page Input with +/- Buttons */}
          <div className="space-y-2">
            <Label htmlFor="currentPage">Текущая страница</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addPages(-1)}
                disabled={currentPage <= 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                id="currentPage"
                type="number"
                min="0"
                max={book.totalPages}
                value={currentPage}
                onChange={(e) => updatePage(parseInt(e.target.value) || 0)}
                className="text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addPages(1)}
                disabled={currentPage >= book.totalPages}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="space-y-2">
            <Label>Быстрое добавление</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => addPages(1)}
                disabled={currentPage >= book.totalPages}
                className="w-full"
              >
                +1
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => addPages(5)}
                disabled={currentPage >= book.totalPages}
                className="w-full"
              >
                +5
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => addPages(10)}
                disabled={currentPage >= book.totalPages}
                className="w-full"
              >
                +10
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => addPages(25)}
                disabled={currentPage >= book.totalPages}
                className="w-full"
              >
                +25
              </Button>
            </div>
          </div>

          {currentPage >= book.totalPages && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                🎉 Поздравляем! Вы закончили читать эту книгу!
              </p>
            </div>
          )}

          <Button type="submit" className="w-full">
            Сохранить прогресс
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}