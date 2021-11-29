export default {
  type: "object",
  properties: {
    userName    : { type: 'string' },
    firstName   : { type: 'string' },
    lastName    : { type: 'string' },
    age         : { type: 'number' }
  },
  required: ['userName']
} as const;
