import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Book } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BookOpen, CheckCircle2, Clock, FileText } from 'lucide-react';

interface StatisticsProps {
  books: Book[];
}

const COLORS = ['#3b82f6', '#10b981', '#64748b', '#f59e0b', '#8b5cf6', '#ec4899'];

export function Statistics({ books }: StatisticsProps) {
  const stats = useMemo(() => {
    const totalBooks = books.length;
    const finishedBooks = books.filter(b => b.status === 'finished').length;
    const readingBooks = books.filter(b => b.status === 'reading').length;
    const plannedBooks = books.filter(b => b.status === 'planned').length;
    
    const totalPages = books.reduce((sum, book) => sum + book.totalPages, 0);
    const readPages = books.reduce((sum, book) => sum + book.currentPage, 0);
    const totalNotes = books.reduce((sum, book) => sum + book.notes.length, 0);

    // Genre distribution
    const genreCount: Record<string, number> = {};
    books.forEach(book => {
      genreCount[book.genre] = (genreCount[book.genre] || 0) + 1;
    });

    const genreData = Object.entries(genreCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Status distribution
    const statusData = [
      { name: 'Читаю', value: readingBooks },
      { name: 'Прочитано', value: finishedBooks },
      { name: 'Планирую', value: plannedBooks },
    ].filter(item => item.value > 0);

    // Monthly reading (last 6 months)
    const monthlyData: Record<string, number> = {};
    const now = new Date();
    
    books.forEach(book => {
      if (book.status === 'finished') {
        const date = new Date(book.dateAdded);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      }
    });

    const monthlyChartData = Object.entries(monthlyData)
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' }),
        count,
      }))
      .slice(-6);

    return {
      totalBooks,
      finishedBooks,
      readingBooks,
      plannedBooks,
      totalPages,
      readPages,
      totalNotes,
      genreData,
      statusData,
      monthlyChartData,
    };
  }, [books]);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-600">Всего книг</CardTitle>
            <BookOpen className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{stats.totalBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-600">Прочитано</CardTitle>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{stats.finishedBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-600">Читаю сейчас</CardTitle>
            <Clock className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{stats.readingBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-600">Всего заметок</CardTitle>
            <FileText className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{stats.totalNotes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pages Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Статистика по страницам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Всего страниц во всех книгах</span>
              <span className="text-slate-900">{stats.totalPages.toLocaleString('ru-RU')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Прочитано страниц</span>
              <span className="text-slate-900">{stats.readPages.toLocaleString('ru-RU')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Процент выполнения</span>
              <span className="text-slate-900">
                {stats.totalPages > 0 ? Math.round((stats.readPages / stats.totalPages) * 100) : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      {books.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Genre Distribution */}
          {stats.genreData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Распределение по жанрам</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.genreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Status Distribution */}
          {stats.statusData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Статус книг</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Monthly Progress */}
          {stats.monthlyChartData.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Прочитанные книги по месяцам</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {books.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            <BarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Статистика будет доступна после добавления книг</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
