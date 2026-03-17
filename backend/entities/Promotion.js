{
  "name": "Promotion",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Promotion title (shown bold)"
    },
    "message": {
      "type": "string",
      "description": "Promotion message or note for customers"
    },
    "type": {
      "type": "string",
      "enum": [
        "announcement",
        "competition",
        "sale",
        "new_arrival"
      ],
      "description": "Type of promotion"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Show on customer shop page"
    },
    "background_color": {
      "type": "string",
      "default": "#D4AF37",
      "description": "Banner background color (hex)"
    },
    "text_color": {
      "type": "string",
      "default": "#1a1a1a",
      "description": "Banner text color (hex)"
    },
    "cta_text": {
      "type": "string",
      "description": "Optional call-to-action button text"
    },
    "sort_order": {
      "type": "number",
      "default": 0,
      "description": "Display order (lower = first)"
    }
  },
  "required": [
    "title",
    "message"
  ]
}