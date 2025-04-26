// models/Click.ts
import { Schema, model, models } from 'mongoose';

const clickSchema = new Schema({
  id:     { type: String, required: true, unique: true },
  count:  { type: Number, default: 0 },
});

export default models.Click || model('Click', clickSchema);
