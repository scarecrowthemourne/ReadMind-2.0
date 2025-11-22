import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Book, BookOpen, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import type { Book as BookType } from './EditBookDialog';

interface StatisticsProps {
  books: BookType[];
}

export function Statistics({ books }: StatisticsProps) {
  const totalBooks = books.length;
  const completedBooks = books.filter(b => b.status === 'completed').length;
  const readingBooks = books.filter(b => b.status === 'reading').length;
  const toReadBooks = books.filter(b => b.status === 'to-read').length;

  const totalPages = books.reduce((sum, book) => sum + book.totalPages, 0);
  const pagesRead = books.reduce((sum, book) => sum + book.currentPage, 0);
  const overallProgress = totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0;

  // Calculate genre statistics
  const genreStats = books.reduce((acc, book) => {
    if (book.genre) {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topGenres = Object.entries(genreStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const stats = [
    {
      title: 'Всего книг',
      value: totalBooks,
      icon: Book,
      color: 'text-blue-500',
    },
    {
      title: 'Прочитано',
      value: completedBooks,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      title: 'Читаю сейчас',
      value: readingBooks,
      icon: BookOpen,
      color: 'text-orange-500',
    },
    {
      title: 'В планах',
      value: toReadBooks,
      icon: Clock,
      color: 'text-gray-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Общий прогресс
            </CardTitle>
            <CardDescription>Прочитано страниц из всех книг</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl">{overallProgress}%</div>
              <p className="text-sm text-muted-foreground">
                {pagesRead.toLocaleString('ru-RU')} из {totalPages.toLocaleString('ru-RU')} страниц
              </p>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Популярные жанры</CardTitle>
            <CardDescription>Ваши любимые категории</CardDescription>
          </CardHeader>
          <CardContent>
            {topGenres.length > 0 ? (
              <div className="space-y-3">
                {topGenres.map(([genre, count]) => (
                  <div key={genre} className="flex items-center justify-between">
                    <span className="text-sm">{genre}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full"
                          style={{ width: `${(count / totalBooks) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Добавьте жанры к книгам для отображения статистики
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reading Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Активность чтения</CardTitle>
          <CardDescription>Краткий обзор вашей библиотеки</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">{completedBooks}</div>
              <p className="text-xs text-muted-foreground">Завершено книг</p>
            </div>
            <div>
              <div className="text-2xl mb-1">{readingBooks}</div>
              <p className="text-xs text-muted-foreground">В процессе</p>
            </div>
            <div>
              <div className="text-2xl mb-1">{Math.round(pagesRead / Math.max(totalBooks, 1))}</div>
              <p className="text-xs text-muted-foreground">Стр. на книгу</p>
            </div>
            <div>
              <div className="text-2xl mb-1">{completedBooks > 0 ? Math.round((completedBooks / totalBooks) * 100) : 0}%</div>
              <p className="text-xs text-muted-foreground">Завершенность</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
