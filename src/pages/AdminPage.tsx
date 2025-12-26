import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

interface StoredUser {
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
  customerEmail: string;
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      date: '25.12.2024',
      status: 'Новый',
      total: 45900,
      items: 2,
      customerEmail: 'customer1@example.com',
    },
    {
      id: 'ORD-002',
      date: '24.12.2024',
      status: 'В обработке',
      total: 23450,
      items: 1,
      customerEmail: 'customer2@example.com',
    },
    {
      id: 'ORD-003',
      date: '23.12.2024',
      status: 'Доставлен',
      total: 78200,
      items: 4,
      customerEmail: 'customer3@example.com',
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  };

  const handleDeleteUser = (email: string) => {
    if (email === user?.email) {
      alert('Нельзя удалить свой аккаунт');
      return;
    }
    if (confirm(`Удалить пользователя ${email}?`)) {
      const updatedUsers = users.filter((u) => u.email !== email);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      loadUsers();
    }
  };

  const handleToggleAdmin = (email: string) => {
    if (email === user?.email) {
      alert('Нельзя изменить свои права администратора');
      return;
    }
    const updatedUsers = users.map((u) =>
      u.email === email ? { ...u, isAdmin: !u.isAdmin } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadUsers();
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert('Заполните все обязательные поля');
      return;
    }
    alert('Товар добавлен (демо-режим)');
    setNewProduct({ name: '', price: '', category: '', stock: '' });
  };

  const handleStatusChange = async (orderId: string, newStatus: string, customerEmail: string, orderTotal: number) => {
    setSendingEmail(orderId);
    
    try {
      const response = await fetch('https://functions.poehali.dev/73ba6ca8-cb98-46dc-8c49-72ae42a59f51', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to_email: customerEmail,
          order_id: orderId,
          status: newStatus,
          order_total: orderTotal,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.demo 
          ? `Email отправлен (демо-режим):\n\nДля полноценной отправки настройте SMTP в секретах проекта.\n\nБудет отправлено на: ${customerEmail}`
          : `Email успешно отправлен на ${customerEmail}`);
        
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert('Ошибка отправки email: ' + (result.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      alert('Ошибка подключения к серверу: ' + error);
    } finally {
      setSendingEmail(null);
    }
  };

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalUsers: users.filter((u) => !u.isAdmin).length,
    newOrders: orders.filter((o) => o.status === 'Новый').length,
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary/20 to-primary/5 py-12">
        <div className="container px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Shield" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Панель администратора</h1>
                <p className="text-muted-foreground">{user?.name} • {user?.email}</p>
              </div>
            </div>
            <Button onClick={logout} variant="outline" className="gap-2">
              <Icon name="LogOut" size={18} />
              Выйти
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon name="ShoppingCart" size={24} className="text-primary" />
              <span className="text-sm text-muted-foreground">Всего заказов</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon name="DollarSign" size={24} className="text-primary" />
              <span className="text-sm text-muted-foreground">Выручка</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} ₽</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Users" size={24} className="text-primary" />
              <span className="text-sm text-muted-foreground">Пользователи</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Bell" size={24} className="text-primary" />
              <span className="text-sm text-muted-foreground">Новые заказы</span>
            </div>
            <p className="text-3xl font-bold">{stats.newOrders}</p>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="orders" className="gap-2">
              <Icon name="Package" size={18} />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Icon name="Users" size={18} />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Icon name="Box" size={18} />
              Товары
            </TabsTrigger>
          </TabsList>

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
                          <select
                            className="text-xs px-2 py-1 rounded-full border bg-background"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value, order.customerEmail, order.total)}
                            disabled={sendingEmail === order.id}
                          >
                            <option>Новый</option>
                            <option>В обработке</option>
                            <option>В пути</option>
                            <option>Доставлен</option>
                            <option>Отменен</option>
                          </select>
                          {sendingEmail === order.id && (
                            <Icon name="Loader2" size={16} className="animate-spin text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.date} • {order.items} товаров • {order.customerEmail}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Сумма</p>
                        <p className="text-xl font-bold text-primary">
                          {order.total.toLocaleString()} ₽
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Icon name="Eye" size={18} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleStatusChange(order.id, order.status, order.customerEmail, order.total)}
                          disabled={sendingEmail === order.id}
                          title="Отправить email уведомление"
                        >
                          <Icon name="Mail" size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Имя</th>
                      <th className="text-left p-4 font-semibold">Email</th>
                      <th className="text-left p-4 font-semibold">Телефон</th>
                      <th className="text-left p-4 font-semibold">Роль</th>
                      <th className="text-left p-4 font-semibold">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.email} className="border-t hover:bg-secondary/20">
                        <td className="p-4">{u.name}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">{u.phone}</td>
                        <td className="p-4">
                          {u.isAdmin ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                              Админ
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                              Пользователь
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAdmin(u.email)}
                              disabled={u.email === user?.email}
                            >
                              <Icon name={u.isAdmin ? 'UserMinus' : 'UserPlus'} size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(u.email)}
                              disabled={u.email === user?.email}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Добавить новый товар</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                <div>
                  <Label htmlFor="product-name">Название товара *</Label>
                  <Input
                    id="product-name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="mt-2"
                    placeholder="Сабвуфер JBL..."
                  />
                </div>
                <div>
                  <Label htmlFor="product-price">Цена *</Label>
                  <Input
                    id="product-price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="mt-2"
                    placeholder="25000"
                  />
                </div>
                <div>
                  <Label htmlFor="product-category">Категория *</Label>
                  <select
                    id="product-category"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="w-full mt-2 px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Выберите категорию</option>
                    <option value="subwoofers">Сабвуферы</option>
                    <option value="speakers">Динамики</option>
                    <option value="amplifiers">Усилители</option>
                    <option value="receivers">Магнитолы</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="product-stock">Количество на складе</Label>
                  <Input
                    id="product-stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    className="mt-2"
                    placeholder="10"
                  />
                </div>
              </div>
              <Button onClick={handleAddProduct} className="mt-6 gap-2">
                <Icon name="Plus" size={18} />
                Добавить товар
              </Button>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="text-xl font-semibold mb-4">Управление товарами</h3>
              <p className="text-muted-foreground">
                Здесь будет список всех товаров с возможностью редактирования и удаления
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}