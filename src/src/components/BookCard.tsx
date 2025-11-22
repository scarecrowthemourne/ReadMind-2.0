import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Book as BookIcon, Clock, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Book } from './EditBookDialog';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  const progress = (book.currentPage / book.totalPages) * 100;

  const statusConfig = {
    'reading': { label: 'Читаю', icon: Clock, color: 'bg-blue-500' },
    'completed': { label: 'Прочитано', icon: CheckCircle2, color: 'bg-green-500' },
    'to-read': { label: 'В планах', icon: BookIcon, color: 'bg-gray-500' },
  };

  const status = statusConfig[book.status];
  const StatusIcon = status.icon;

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-[2/3] relative bg-muted">
        {book.coverUrl ? (
          <ImageWithFallback
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookIcon className="w-16 h-16 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className={`${status.color} text-white`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="line-clamp-1 mb-1">{book.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
          {book.author}
        </p>
        {book.genre && (
          <Badge variant="secondary" className="mb-3 text-xs">
            {book.genre}
          </Badge>
        )}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Прогресс</span>
            <span>{book.currentPage} / {book.totalPages}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}
