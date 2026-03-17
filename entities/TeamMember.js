import { base44 } from '@/api/Client';

export const TeamMember = base44.entities.TeamMember;{
  "name": "TeamMember",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "role": {
      "type": "string"
    },
    "bio": {
      "type": "string"
    },
    "image_url": {
      "type": "string"
    },
    "sort_order": {
      "type": "number",
      "default": 0
    }
  },
  "required": [
    "name",
    "role"
  ]
}