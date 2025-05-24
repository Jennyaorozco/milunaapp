"use client"; 

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Asegúrate que esta ruta sea correcta

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center text-pink-600">Cargando productos...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!products.length) return <p className="text-center text-gray-500">No hay productos disponibles.</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-pink-700">Explora Nuestros Productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6 transform transition-transform duration-300 hover:scale-105">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
            )}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            {product.price && (
              <p className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}