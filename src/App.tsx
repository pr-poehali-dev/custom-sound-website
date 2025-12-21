import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from '@/components/Header';
import HomePage from '@/pages/HomePage';
import SearchPage from '@/pages/SearchPage';
import ProfilePage from '@/pages/ProfilePage';

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'search' | 'profile'>('home');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background text-foreground">
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <main>
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'search' && <SearchPage />}
            {currentPage === 'profile' && <ProfilePage />}
          </main>
          <footer className="border-t border-border mt-auto">
            <div className="container py-12 px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">CUSTOM SOUND</h3>
                  <p className="text-muted-foreground">
                    Профессиональное автомобильное аудио оборудование премиум класса
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Каталог</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><a href="#" className="hover:text-primary transition-colors">Сабвуферы</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Динамики</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Усилители</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Магнитолы</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Информация</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><a href="#" className="hover:text-primary transition-colors">О компании</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Доставка</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Оплата</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Гарантия</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Контакты</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>+7 (999) 123-45-67</li>
                    <li>info@customsound.ru</li>
                    <li>Москва, ул. Примерная, 1</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
                <p>&copy; 2024 Custom Sound. Все права защищены.</p>
              </div>
            </div>
          </footer>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;