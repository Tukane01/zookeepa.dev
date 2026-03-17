{
  "name": "Order",
  "type": "object",
  "properties": {
    "order_number": {
      "type": "string",
      "description": "Unique order number"
    },
    "customer_email": {
      "type": "string",
      "description": "Customer email"
    },
    "customer_name": {
      "type": "string",
      "description": "Customer full name"
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "product_id": {
            "type": "string"
          },
          "product_name": {
            "type": "string"
          },
          "price": {
            "type": "number"
          },
          "quantity": {
            "type": "number"
          },
          "size": {
            "type": "string"
          },
          "color": {
            "type": "string"
          },
          "image_url": {
            "type": "string"
          }
        }
      },
      "description": "Order items"
    },
    "total_amount": {
      "type": "number",
      "description": "Total order amount"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ],
      "default": "pending",
      "description": "Order status"
    },
    "shipping_address": {
      "type": "object",
      "properties": {
        "street": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "zip_code": {
          "type": "string"
        },
        "country": {
          "type": "string"
        }
      }
    },
    "phone": {
      "type": "string",
      "description": "Customer phone number"
    },
    "notes": {
      "type": "string",
      "description": "Order notes"
    }
  },
  "required": [
    "customer_email",
    "items",
    "total_amount"
  ]
}