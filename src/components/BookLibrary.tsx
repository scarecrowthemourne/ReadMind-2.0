import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BookCard } from './BookCard';
import { Book } from '../App';

interface BookLibraryProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export function BookLibrary({ books, onSelectBook }: BookLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');

  // Get unique genres
  const genres = useMemo(() => {
    const uniqueGenres = new Set(books.map(book => book.genre));
    return Array.from(uniqueGenres).sort();
  }, [books]);

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
      const matchesGenre = genreFilter === 'all' || book.genre === genreFilter;

      return matchesSearch && matchesStatus && matchesGenre;
    });
  }, [books, searchQuery, statusFilter, genreFilter]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Поиск по названию или автору..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="reading">Читаю</SelectItem>
                <SelectItem value="finished">Прочитано</SelectItem>
                <SelectItem value="planned">Планирую</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Genre Filter */}
          <div className="md:col-span-2">
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Жанр" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все жанры</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500">
            {books.length === 0 
              ? 'Библиотека пуста. Добавьте первую книгу!' 
              : 'Книги не найдены. Попробуйте изменить параметры поиска.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => onSelectBook(book)}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredBooks.length > 0 && (
        <p className="text-center text-slate-500">
          Найдено книг: {filteredBooks.length}
        </p>
      )}
    </div>
  );
}
