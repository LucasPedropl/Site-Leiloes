export interface Bid {
    id: string;
    amount: number;
    bidderName: string;
    timestamp: Date;
}

export interface AuctionItem {
    id: string;
    lotNumber: number; // Número do Lote
    title: string;
    description: string;
    imageUrl: string;
    currentBid: number;
    startingBid: number;
    increment: number; // Incremento mínimo
    endsAt: Date;
    bids: Bid[];
    category: 'Imóveis' | 'Veículos' | 'Arte' | 'Judicial' | 'Outros';
    location: string; // Cidade/UF
    status: 'open' | 'closed' | 'preview';
}

export enum ViewState {
    HOME = 'HOME',
    DETAIL = 'DETAIL'
}