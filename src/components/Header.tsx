import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  currentPage: 'home' | 'search' | 'profile' | 'admin';
  onNavigate: (page: 'home' | 'search' | 'profile' | 'admin') => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { items, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isAdmin } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="text-2xl font-bold text-primary transition-all group-hover:scale-110">
              CUSTOM SOUND
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'home' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => onNavigate('search')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'search' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Поиск
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'profile' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Личный кабинет
            </button>
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                  currentPage === 'admin' ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                <Icon name="Shield" size={16} />
                Админ-панель
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Icon name="ShoppingCart" size={48} className="mb-4 opacity-50" />
                    <p>Корзина пуста</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-card">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.price.toLocaleString()} ₽ × {item.quantity}
                            </p>
                            <p className="text-primary font-bold mt-1">
                              {(item.price * item.quantity).toLocaleString()} ₽
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="Trash2" size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-semibold text-lg">Итого:</span>
                        <span className="font-bold text-xl text-primary">
                          {getTotalPrice().toLocaleString()} ₽
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" size="lg">
                          Оформить заказ
                        </Button>
                        <Button variant="outline" size="lg" onClick={clearCart}>
                          Очистить
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Icon name="Menu" size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>CUSTOM SOUND</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  <button
                    onClick={() => onNavigate('home')}
                    className={`text-left py-2 px-4 rounded-lg transition-colors ${
                      currentPage === 'home' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                  >
                    Главная
                  </button>
                  <button
                    onClick={() => onNavigate('search')}
                    className={`text-left py-2 px-4 rounded-lg transition-colors ${
                      currentPage === 'search' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                  >
                    Поиск
                  </button>
                  <button
                    onClick={() => onNavigate('profile')}
                    className={`text-left py-2 px-4 rounded-lg transition-colors ${
                      currentPage === 'profile' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                  >
                    Личный кабинет
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onNavigate('admin')}
                      className={`text-left py-2 px-4 rounded-lg transition-colors flex items-center gap-2 ${
                        currentPage === 'admin' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                    >
                      <Icon name="Shield" size={18} />
                      Админ-панель
                    </button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}