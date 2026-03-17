{
  "name": "GalleryItem",
  "type": "object",
  "properties": {
    "image_url": {
      "type": "string"
    },
    "caption": {
      "type": "string"
    },
    "category": {
      "type": "string"
    },
    "sort_order": {
      "type": "number",
      "default": 0
    }
  },
  "required": [
    "image_url"
  ]
}