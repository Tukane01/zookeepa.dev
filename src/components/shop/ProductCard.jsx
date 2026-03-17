import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProductCard({ product }) {
  return (
    <Link to={createPageUrl("ProductDetail") + "?id=" + product.id}>
      <Card className="group overflow-hidden border-none shadow-none hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-400">No image</p>
              </div>
            )}
            {product.is_featured && (
              <Badge className="absolute top-3 left-3 bg-black text-white">
                Featured
              </Badge>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="font-medium text-lg text-gray-900 group-hover:text-gray-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-black">${product.price?.toFixed(2)}</p>
              {product.colors && product.colors.length > 0 && (
                <div className="flex gap-1">
                  {product.colors.slice(0, 4).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}