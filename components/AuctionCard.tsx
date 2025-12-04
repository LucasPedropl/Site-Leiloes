import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';
import { Button } from './Button';
import { Clock, ArrowRight, MapPin, Gavel } from 'lucide-react';

interface AuctionCardProps {
  item: AuctionItem;
  onClick: (item: AuctionItem) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ item, onClick }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = item.endsAt.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        
        if (days > 0) return `${days}d ${hours}h restam`;
        return `${hours}h ${minutes}m restam`;
      } else {
        return 'Encerrado';
      }
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, [item.endsAt]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div 
      onClick={() => onClick(item)}
      className="group bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-400 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative"
    >
      <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-2 py-1 rounded border border-gray-200 shadow-sm">
        LOTE {item.lotNumber.toString().padStart(3, '0')}
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-md text-xs font-semibold shadow-sm border flex items-center gap-1
            ${timeLeft === 'Encerrado' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-white/90 text-slate-800 border-gray-100 backdrop-blur-sm'}`}>
          <Clock className="w-3 h-3" /> {timeLeft}
        </div>
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{item.category}</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 leading-tight group-hover:text-slate-700 transition-colors">
            {item.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
      </div>

      <div className="flex items-end justify-between border-t border-gray-100 pt-4 mt-4">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Lance Atual</p>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(item.currentBid)}</p>
        </div>
        <Button variant="secondary" size="sm" className="group-hover:bg-slate-900 group-hover:text-white transition-colors">
          Dar Lance <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};