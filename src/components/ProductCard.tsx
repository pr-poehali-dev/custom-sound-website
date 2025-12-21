import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  onProductClick?: (id: string) => void;
}

export default function ProductCard({ id, name, price, oldPrice, discount, image, onProductClick }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, name, price, image });
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(id);
    }
  };

  return (
    <Card 
      className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20 animate-fade-in cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {discount && (
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground text-lg font-bold">
            {discount}% SALE
          </Badge>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-primary">
            {price.toLocaleString()} ₽
          </span>
          {oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {oldPrice.toLocaleString()} ₽
            </span>
          )}
        </div>
        <Button 
          className="w-full gap-2 group-hover:gap-3 transition-all" 
          onClick={handleAddToCart}
        >
          <Icon name="ShoppingCart" size={18} />
          В корзину
        </Button>
      </div>
    </Card>
  );
}