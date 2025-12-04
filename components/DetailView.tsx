import React, { useState, useEffect } from 'react';
import { AuctionItem, Bid } from '../types';
import { Button } from './Button';
import { generateItemInsight } from '../services/geminiService';
import { ArrowLeft, Sparkles, User, History, ShieldCheck, Clock, FileText, Download, Gavel, AlertCircle, MapPin } from 'lucide-react';

interface DetailViewProps {
  item: AuctionItem;
  onBack: () => void;
  onPlaceBid: (amount: number) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ item, onBack, onPlaceBid }) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(item.currentBid + item.increment);
  const [timeLeft, setTimeLeft] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'edital'>('info');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  useEffect(() => {
    const fetchInsight = async () => {
        setLoadingInsight(true);
        const text = await generateItemInsight(item.title, item.currentBid);
        setInsight(text);
        setLoadingInsight(false);
    };
    fetchInsight();
  }, [item.title, item.currentBid]);

  // Update bid amount if someone else bids
  useEffect(() => {
    setBidAmount(item.currentBid + item.increment);
  }, [item.currentBid, item.increment]);

  useEffect(() => {
      const updateTimer = () => {
        const now = new Date().getTime();
        const end = item.endsAt.getTime();
        const diff = end - now;
        
        if (diff <= 0) {
            setTimeLeft("Encerrado");
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
  }, [item.endsAt]);

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount >= item.currentBid + item.increment) {
      onPlaceBid(bidAmount);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="group flex items-center text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors"
        >
          <div className="mr-2 p-1 rounded-full bg-white border border-gray-200 group-hover:border-gray-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Voltar para leilões
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Images & Info */}
        <div className="lg:col-span-8 space-y-8">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm relative group">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-3 py-1.5 rounded-md text-sm font-bold backdrop-blur-md">
                    LOTE {item.lotNumber.toString().padStart(3, '0')}
                </div>
            </div>

            {/* Tabs for content */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`${
                      activeTab === 'info'
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    Detalhes do Lote
                  </button>
                  <button
                    onClick={() => setActiveTab('edital')}
                    className={`${
                      activeTab === 'edital'
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    Edital e Documentos
                  </button>
                </nav>
            </div>

            <div className="space-y-6">
                {activeTab === 'info' ? (
                    <>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-slate-700 text-xs font-semibold border border-gray-200">
                                {item.category}
                            </span>
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
                                <ShieldCheck className="w-3 h-3" /> Verificado
                            </span>
                             <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                                <MapPin className="w-3 h-3" /> {item.location}
                            </span>
                        </div>
                        
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">{item.title}</h1>
                            <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">{item.description}</p>
                        </div>
                        
                        {/* AI Insight */}
                        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 relative overflow-hidden">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white rounded-lg border border-indigo-100 shadow-sm text-indigo-600">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-indigo-900 mb-1">Análise do Especialista (IA)</h3>
                                    {loadingInsight ? (
                                        <div className="space-y-2 mt-2">
                                            <div className="h-4 w-3/4 bg-indigo-100/50 animate-pulse rounded"></div>
                                            <div className="h-4 w-1/2 bg-indigo-100/50 animate-pulse rounded"></div>
                                        </div>
                                    ) : (
                                        <p className="text-indigo-800 text-sm leading-relaxed italic">"{insight}"</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Edital Oficial do Leilão.pdf</p>
                                    <p className="text-xs text-gray-500">2.4 MB • PDF</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="w-3 h-3" /> Baixar
                            </Button>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Matrícula do Imóvel / Documento.pdf</p>
                                    <p className="text-xs text-gray-500">1.1 MB • PDF</p>
                                </div>
                            </div>
                             <Button variant="outline" size="sm" className="gap-2">
                                <Download className="w-3 h-3" /> Baixar
                            </Button>
                        </div>
                         <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Regras de Participação.pdf</p>
                                    <p className="text-xs text-gray-500">800 KB • PDF</p>
                                </div>
                            </div>
                             <Button variant="outline" size="sm" className="gap-2">
                                <Download className="w-3 h-3" /> Baixar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Bidding Interface */}
        <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
                {/* Timer Card */}
                <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2 opacity-80">
                        <span className="text-xs font-bold uppercase tracking-wider">Encerra em</span>
                        <Clock className="w-4 h-4" />
                    </div>
                    <div className="text-3xl font-mono font-bold tracking-tight">
                        {timeLeft}
                    </div>
                </div>

                {/* Bidding Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <div className="mb-6">
                        <span className="text-sm text-gray-500 font-medium">Lance Atual</span>
                        <div className="text-4xl font-bold text-slate-900 mt-1">
                            {formatCurrency(item.currentBid)}
                        </div>
                        <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Incremento mínimo de {formatCurrency(item.increment)}
                        </div>
                    </div>

                    <form onSubmit={handleBid} className="space-y-4 mb-6">
                        <div>
                            <label htmlFor="bid" className="block text-sm font-medium text-gray-700 mb-2">Seu Lance Máximo</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                                <input 
                                    type="number"
                                    id="bid"
                                    min={item.currentBid + item.increment}
                                    step={item.increment}
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(Number(e.target.value))}
                                    className="block w-full pl-9 pr-3 py-3 rounded-lg border-gray-200 focus:ring-slate-900 focus:border-slate-900 font-medium text-lg"
                                />
                            </div>
                        </div>
                        <Button fullWidth size="lg" className="h-12 text-base shadow-md">
                            <Gavel className="w-4 h-4 mr-2" /> Confirmar Lance
                        </Button>
                        <p className="text-center text-xs text-gray-400 leading-tight">
                            Ao dar o lance, você concorda com os <a href="#" className="underline">Termos do Edital</a>.
                        </p>
                    </form>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <History className="w-3 h-3" /> Sala de Disputa (Lances)
                        </h4>
                        <div className="space-y-4 relative">
                             {/* Vertical line for timeline effect */}
                             <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-100"></div>

                            {item.bids.length === 0 ? (
                                <p className="text-sm text-gray-400 pl-4">Aguardando primeiro lance...</p>
                            ) : (
                                item.bids.slice().reverse().slice(0, 5).map((bid) => (
                                    <div key={bid.id} className="flex items-center justify-between text-sm relative pl-4 animate-in slide-in-from-left-2 duration-300">
                                        <div className="flex items-center gap-3 bg-white z-10 py-1">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                {bid.bidderName.substring(0,2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-xs">{bid.bidderName}</p>
                                                <p className="text-gray-400 text-[10px]">
                                                    {bid.timestamp.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-mono font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs border border-green-100">
                                            {formatCurrency(bid.amount)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                    <p className="text-xs text-gray-500">Dúvidas sobre este lote?</p>
                    <button className="text-sm font-semibold text-slate-900 hover:underline">Fale com o Leiloeiro</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};