import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BookCard } from './BookCard';
import { Plus, Search } from 'lucide-react';
import type { Book } from './EditBookDialog';

interface BookLibraryProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  onAddBookClick: () => void;
}

export function BookLibrary({ books, onBookClick, onAddBookClick }: BookLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'progress' | 'recent'>('recent');
  const [filterStatus, setFilterStatus] = useState<'all' | 'reading' | 'completed' | 'to-read'>('all');

  // Filter books
  let filteredBooks = books;

  if (filterStatus !== 'all') {
    filteredBooks = filteredBooks.filter(book => book.status === filterStatus);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre?.toLowerCase().includes(query)
    );
  }

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'progress':
        const progressA = a.currentPage / a.totalPages;
        const progressB = b.currentPage / b.totalPages;
        return progressB - progressA;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const readingBooks = sortedBooks.filter(b => b.status === 'reading');
  const completedBooks = sortedBooks.filter(b => b.status === 'completed');
  const toReadBooks = sortedBooks.filter(b => b.status === 'to-read');

  const renderBookGrid = (books: Book[]) => {
    if (books.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Книг не найдено</p>
          <Button onClick={onAddBookClick}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить книгу
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map(book => (
          <BookCard key={book.id} book={book} onClick={() => onBookClick(book)} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Поиск по названию, автору или жанру..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Недавние</SelectItem>
            <SelectItem value="title">По названию</SelectItem>
            <SelectItem value="author">По автору</SelectItem>
            <SelectItem value="progress">По прогрессу</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onAddBookClick}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <Tabs value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
        <TabsList>
          <TabsTrigger value="all">Все ({books.length})</TabsTrigger>
          <TabsTrigger value="reading">Читаю ({books.filter(b => b.status === 'reading').length})</TabsTrigger>
          <TabsTrigger value="completed">Прочитано ({books.filter(b => b.status === 'completed').length})</TabsTrigger>
          <TabsTrigger value="to-read">В планах ({books.filter(b => b.status === 'to-read').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderBookGrid(sortedBooks)}
        </TabsContent>

        <TabsContent value="reading" className="mt-6">
          {renderBookGrid(readingBooks)}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {renderBookGrid(completedBooks)}
        </TabsContent>

        <TabsContent value="to-read" className="mt-6">
          {renderBookGrid(toReadBooks)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
