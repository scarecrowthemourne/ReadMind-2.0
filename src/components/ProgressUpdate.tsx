import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Plus, Minus } from 'lucide-react';
import type { Book } from './EditBookDialog';

interface ProgressUpdateProps {
  book: Book;
  onUpdateProgress: (bookId: string, currentPage: number) => void;
}

export function ProgressUpdate({ book, onUpdateProgress }: ProgressUpdateProps) {
  const [pageInput, setPageInput] = useState(book.currentPage.toString());
  
  const progress = (book.currentPage / book.totalPages) * 100;

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(0, Math.min(newPage, book.totalPages));
    setPageInput(validPage.toString());
    onUpdateProgress(book.id, validPage);
  };

  const handleInputChange = (value: string) => {
    setPageInput(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= book.totalPages) {
      onUpdateProgress(book.id, numValue);
    }
  };

  const quickAdd = (pages: number) => {
    handlePageChange(book.currentPage + pages);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Прогресс чтения</Label>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(book.currentPage - 1)}
            disabled={book.currentPage === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <div className="relative">
              <Input
                type="number"
                min="0"
                max={book.totalPages}
                value={pageInput}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-center pr-20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                / {book.totalPages}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(book.currentPage + 1)}
            disabled={book.currentPage >= book.totalPages}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => quickAdd(10)}
            disabled={book.currentPage >= book.totalPages}
            className="flex-1"
          >
            +10
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => quickAdd(25)}
            disabled={book.currentPage >= book.totalPages}
            className="flex-1"
          >
            +25
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => quickAdd(50)}
            disabled={book.currentPage >= book.totalPages}
            className="flex-1"
          >
            +50
          </Button>
        </div>
      </div>
    </div>
  );
}
