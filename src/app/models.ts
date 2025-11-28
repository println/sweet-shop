export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagemURL: string;
  tipo: string;
  destaqueHome: number; // 0 or 1
}

export interface CartItem {
  product: Product;
  quantidade: number;
}

export interface UserProfile {
  nome: string;
  telefone: string;
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    referencia: string;
  };
}

export interface AppState {
  cart: CartItem[];
  profile: UserProfile;
}
