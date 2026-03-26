import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ProductFormDialog from "./ProductFormDialog";
import { Badge } from "@/components/ui/badge";
import { productsAPI } from "@/api/apiService";

const fetchProducts = async () => {
  return await productsAPI.getAll();
};

const deleteProduct = async (id) => {
  return await productsAPI.delete(id);
};

export default function ProductManagement() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchProducts,
    initialData: [],
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
          className="bg-black hover:bg-gray-800 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-400">No image</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <div className="flex gap-1">
                    {product.is_featured && <Badge className="bg-black text-white text-xs">Featured</Badge>}
                    {!product.is_active && <Badge variant="destructive" className="text-xs">Inactive</Badge>}
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.description}</p>
                <p className="text-xl font-bold mb-2">${parseFloat(product.price || 0).toFixed(2)}</p>
                <p className="text-sm text-gray-600 mb-4">Stock: {product.stock || 0}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Pencil className="w-5 h-5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <ProductFormDialog
          product={selectedProduct}
          onClose={() => {
            setShowForm(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}