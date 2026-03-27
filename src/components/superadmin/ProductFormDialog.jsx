import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { productsAPI } from "@/api/apiService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, ImageIcon, Plus, X, Save } from "lucide-react";

export default function ProductFormDialog({ product, onClose }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(product?.image_url || "");

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    sale_price: product?.sale_price || null,
    category: product?.category || "tops",
    sizes: product?.sizes || ["S", "M", "L"],
    colors: product?.colors || ["Black", "White"],
    image_id: product?.image_id || null,
    stock: product?.stock || 0,
    is_featured: product?.is_featured || false,
    is_active: product?.is_active ?? true,
  });

  const [colorInput, setColorInput] = useState("");

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        sizes: data.sizes || [],
        colors: data.colors || [],
      };
      if (product) {
        return await productsAPI.update(product.id, payload);
      }
      return await productsAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setErrorMessage("");
      onClose();
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to save product');
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage("");

    try {
      const form = new FormData();
      form.append('image', file);
      form.append('altText', formData.name || '');

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        headers,
        body: form,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Image upload failed');
      }

      const result = await response.json();
      setFormData(prev => ({ ...prev, image_id: result.id }));
      setImagePreviewUrl(URL.createObjectURL(file));
    } catch (err) {
      console.error('Image upload error:', err);
      setErrorMessage(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleSize = (size) => {
    const sizes = formData.sizes.includes(size)
      ? formData.sizes.filter(s => s !== size)
      : [...formData.sizes, size];
    setFormData({ ...formData, sizes });
  };

  const addColor = () => {
    if (colorInput && !formData.colors.includes(colorInput)) {
      setFormData({ ...formData, colors: [...formData.colors, colorInput] });
      setColorInput("");
    }
  };

  const removeColor = (color) => {
    setFormData({ ...formData, colors: formData.colors.filter(c => c !== color) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) {
      setErrorMessage('Name and price are required');
      return;
    }
    saveMutation.mutate(formData);
  };

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Image Upload */}
          <div>
            <Label>Product Image</Label>
            <div className="mt-2">
              {imagePreviewUrl ? (
                <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={imagePreviewUrl} alt="Product" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => {
                      setFormData({ ...formData, image_id: null });
                      setImagePreviewUrl("");
                    }}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" /> Change Image
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tops">Tops</SelectItem>
                  <SelectItem value="bottoms">Bottoms</SelectItem>
                  <SelectItem value="dresses">Dresses</SelectItem>
                  <SelectItem value="outerwear">Outerwear</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <Label>Available Sizes</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {allSizes.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={formData.sizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSize(size)}
                  className={formData.sizes.includes(size) ? "bg-black text-white" : ""}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <Label>Available Colors</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Enter color name"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
              />
              <Button type="button" onClick={addColor}><Plus className="w-4 h-4 mr-2" /> Add</Button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {formData.colors.map((color) => (
                <div
                  key={color}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                  <span className="text-sm">{color}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured" className="cursor-pointer">Featured Product</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active" className="cursor-pointer">Active (visible to customers)</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button
              type="submit"
              disabled={saveMutation.isPending || uploading}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {saveMutation.isPending ? 'Saving...' : (
                <><Save className="w-4 h-4 mr-2" /> {product ? 'Update Product' : 'Create Product'}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}