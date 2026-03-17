{
  "name": "Product",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Product name"
    },
    "description": {
      "type": "string",
      "description": "Detailed product description"
    },
    "price": {
      "type": "number",
      "description": "Product price"
    },
    "sale_price": {
      "type": "number",
      "description": "Optional sale/discounted price"
    },
    "category": {
      "type": "string",
      "enum": [
        "tops",
        "bottoms",
        "dresses",
        "outerwear",
        "accessories",
        "shoes"
      ],
      "description": "Product category"
    },
    "sizes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "XXL"
        ]
      },
      "description": "Available sizes"
    },
    "colors": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Available colors"
    },
    "image_url": {
      "type": "string",
      "description": "Main product image URL"
    },
    "additional_images": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Additional product images"
    },
    "stock": {
      "type": "number",
      "description": "Available stock quantity",
      "default": 0
    },
    "is_featured": {
      "type": "boolean",
      "description": "Featured product flag",
      "default": false
    },
    "is_active": {
      "type": "boolean",
      "description": "Product active status",
      "default": true
    }
  },
  "required": [
    "name",
    "price",
    "category"
  ]
}