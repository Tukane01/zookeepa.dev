{
  "name": "Event",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "date": {
      "type": "string",
      "format": "date"
    },
    "location": {
      "type": "string"
    },
    "image_url": {
      "type": "string"
    }
  },
  "required": [
    "title"
  ]
}