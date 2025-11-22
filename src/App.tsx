import { useState, useEffect } from 'react';
import { Auth } from './src/components/Auth';
import { BookLibrary } from './src/components/BookLibrary';
import { BookDetail } from './src/components/BookDetail';
import { AddBookDialog } from './src/components/AddBookDialog';
import { EditBookDialog } from './src/components/EditBookDialog';
import { Statistics } from './src/components/Statistics';
import { Button } from './src/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './src/components/ui/tabs';
import { getCurrentUser, signOut } from './src/lib/localAuth';
import { BookOpen, BarChart3, LogOut, User } from 'lucide-react';
import type { Book } from './src/components/EditBookDialog';

interface Note {
  id: string;
  text: string;
  page?: number;
  createdAt: string;
  bookId: string;
  userId: string;
}

function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [books, setBooks] = useState<Book[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('library');

  // Load data from localStorage
  useEffect(() => {
    if (user) {
      const storedBooks = localStorage.getItem(`books_${user.id}`);
      const storedNotes = localStorage.getItem(`notes_${user.id}`);
      
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      }
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    }
  }, [user]);

  // Save books to localStorage
  useEffect(() => {
    if (user && books.length > 0) {
      localStorage.setItem(`books_${user.id}`, JSON.stringify(books));
    }
  }, [books, user]);

  // Save notes to localStorage
  useEffect(() => {
    if (user && notes.length > 0) {
      localStorage.setItem(`notes_${user.id}`, JSON.stringify(notes));
    }
  }, [notes, user]);

  const handleAuth = () => {
    setUser(getCurrentUser());
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setBooks([]);
    setNotes([]);
  };

  const handleAddBook = (bookData: Omit<Book, 'id' | 'status' | 'createdAt' | 'userId'>) => {
    if (!user) return;

    const newBook: Book = {
      ...bookData,
      id: `book_${Date.now()}`,
      status: bookData.currentPage === 0 ? 'to-read' : 'reading',
      createdAt: new Date().toISOString(),
      userId: user.id,
    };

    setBooks([...books, newBook]);
  };

  const handleUpdateBook = (bookId: string, updates: Partial<Book>) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, ...updates } : book
    ));
    
    if (selectedBook?.id === bookId) {
      setSelectedBook({ ...selectedBook, ...updates });
    }
  };

  const handleDeleteBook = () => {
    if (!selectedBook) return;
    
    setBooks(books.filter(book => book.id !== selectedBook.id));
    setNotes(notes.filter(note => note.bookId !== selectedBook.id));
    setIsDetailOpen(false);
    setSelectedBook(null);
  };

  const handleUpdateProgress = (bookId: string, currentPage: number) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const updates: Partial<Book> = {
      currentPage,
      status: currentPage >= book.totalPages ? 'completed' : 'reading',
    };

    handleUpdateBook(bookId, updates);
  };

  const handleMarkAsCompleted = (bookId: string) => {
    handleUpdateBook(bookId, { status: 'completed' });
  };

  const handleAddNote = (bookId: string, text: string, page?: number) => {
    if (!user) return;

    const newNote: Note = {
      id: `note_${Date.now()}`,
      text,
      page,
      createdAt: new Date().toISOString(),
      bookId,
      userId: user.id,
    };

    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDetailOpen(true);
  };

  const handleEditClick = () => {
    setIsDetailOpen(false);
    setIsEditDialogOpen(true);
  };

  if (!user) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl">ReadMind</h1>
                <p className="text-sm text-muted-foreground">Личная библиотека</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                <span>{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Библиотека
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Статистика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            <BookLibrary
              books={books}
              onBookClick={handleBookClick}
              onAddBookClick={() => setIsAddDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="statistics">
            <Statistics books={books} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <AddBookDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddBook={handleAddBook}
      />

      <EditBookDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        book={selectedBook}
        onUpdateBook={handleUpdateBook}
      />

      <BookDetail
        book={selectedBook}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onEdit={handleEditClick}
        onDelete={handleDeleteBook}
        onUpdateProgress={handleUpdateProgress}
        onMarkAsCompleted={handleMarkAsCompleted}
        notes={notes}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}

export default App;
