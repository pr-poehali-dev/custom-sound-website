import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import HomePage from '@/pages/HomePage';
import SearchPage from '@/pages/SearchPage';
import ProfilePage from '@/pages/ProfilePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import AuthPage from '@/pages/AuthPage';
import AdminPage from '@/pages/AdminPage';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'search' | 'profile' | 'admin'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleBackFromProduct = () => {
    setSelectedProductId(null);
  };

  const handleNavigate = (page: 'home' | 'search' | 'profile' | 'admin') => {
    if (page === 'profile' && !isAuthenticated) {
      setShowAuth(true);
      return;
    }
    if (page === 'admin' && !isAdmin) {
      alert('Доступ запрещен');
      return;
    }
    setCurrentPage(page);
    setSelectedProductId(null);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    if (isAdmin) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('profile');
    }
  };

  if (showAuth) {
    return <AuthPage onSuccess={handleAuthSuccess} />;
  }

  return (
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background text-foreground">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <main>
            {selectedProductId ? (
              <ProductDetailPage productId={selectedProductId} onBack={handleBackFromProduct} />
            ) : (
              <>
                {currentPage === 'home' && <HomePage onProductClick={handleProductClick} />}
                {currentPage === 'search' && <SearchPage onProductClick={handleProductClick} />}
                {currentPage === 'profile' && <ProfilePage />}
                {currentPage === 'admin' && <AdminPage />}
              </>
            )}
          </main>
          <footer className="border-t border-border mt-auto">
            <div className="container py-12 px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-[#000000]">CUSTOM SOUND</h3>
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
                <p>Магазин автозвука Custom sound ИП Унгер Я. В. ИНН...ОГРНИП... </p>
              </div>
            </div>
          </footer>
        </div>
      </TooltipProvider>
  );
}

export default App;