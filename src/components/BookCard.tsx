import { Book } from '../App';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BookOpen, User, Tag } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const statusConfig = {
  reading: { label: 'Читаю', color: 'bg-blue-500' },
  finished: { label: 'Прочитано', color: 'bg-green-500' },
  planned: { label: 'Планирую', color: 'bg-slate-500' },
};

export function BookCard({ book, onClick }: BookCardProps) {
  const progress = Math.round((book.currentPage / book.totalPages) * 100);
  const status = statusConfig[book.status];

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {book.title}
            </h3>
          </div>
          <Badge className={`${status.color} text-white shrink-0`}>
            {status.label}
          </Badge>
        </div>
        
        <div className="space-y-2 text-slate-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 shrink-0" />
            <span className="truncate">{book.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 shrink-0" />
            <span className="truncate">{book.genre}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-slate-600">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{book.currentPage} / {book.totalPages}</span>
          </div>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}
