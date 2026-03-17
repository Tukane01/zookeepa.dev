{
  "name": "Career",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "department": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship"
      ],
      "default": "Full-time"
    },
    "location": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "is_open": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "title",
    "department"
  ]
}