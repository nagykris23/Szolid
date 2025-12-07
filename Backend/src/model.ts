// mock termékek

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
};

export let products: Product[] = [
  {
    id: 1,
    name: "The Man 02",
    description: "Férfi szilárd parfüm, fás-fűszeres illat",
    price: 5000,
    category: "parfum",
  },
  {
    id: 2,
    name: "Angel",
    description: "Édes, virágos női szilárd parfüm",
    price: 4500,
    category: "parfum",
  },
  {
    id: 3,
    name: "Dezodor",
    description: "Természetes szilárd dezodor",
    price: 3500,
    category: "dezodor",
  },
];
