import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { useCart } from '@/hooks/useCart';

export default function ProfilePage() {
  const { items } = useCart();
  const [name, setName] = useState('Иван Петров');
  const [email, setEmail] = useState('ivan@example.com');
  const [phone, setPhone] = useState('+7 (999) 123-45-67');

  const orders = [
    {
      id: 'ORD-001',
      date: '15.12.2024',
      status: 'Доставлен',
      total: 23450,
      items: 3,
    },
    {
      id: 'ORD-002',
      date: '10.12.2024',
      status: 'В пути',
      total: 15900,
      items: 1,
    },
    {
      id: 'ORD-003',
      date: '05.12.2024',
      status: 'Доставлен',
      total: 9002,
      items: 2,
    },
  ];

  const savedItems = items.slice(0, 3);

  return (
    <div className="min-h-screen">
      <section className="bg-secondary/30 py-12">
        <div className="container px-4">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                ИП
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold mb-2">{name}</h1>
              <p className="text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 px-4">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="gap-2">
              <Icon name="User" size={18} />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Icon name="Package" size={18} />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Icon name="Heart" size={18} />
              Сохраненное
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Личная информация</h2>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <Button className="gap-2">
                  <Icon name="Save" size={18} />
                  Сохранить изменения
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon name="Package" size={24} className="text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg">Заказ {order.id}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'Доставлен' 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-blue-500/20 text-blue-500'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.date} • {order.items} товаров
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Сумма заказа</p>
                        <p className="text-xl font-bold text-primary">
                          {order.total.toLocaleString()} ₽
                        </p>
                      </div>
                      <Button variant="outline" size="icon">
                        <Icon name="Eye" size={18} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved">
            {savedItems.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="Heart" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-2xl font-semibold mb-2">Нет сохраненных товаров</h3>
                <p className="text-muted-foreground mb-6">
                  Добавляйте товары в избранное, чтобы не потерять их
                </p>
                <Button>
                  Перейти к покупкам
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2"
                      >
                        <Icon name="Heart" size={18} className="fill-primary text-primary" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2">{item.name}</h4>
                      <p className="text-xl font-bold text-primary mb-3">
                        {item.price.toLocaleString()} ₽
                      </p>
                      <Button className="w-full gap-2">
                        <Icon name="ShoppingCart" size={16} />
                        В корзину
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
