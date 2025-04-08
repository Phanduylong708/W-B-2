const mongoose = require('mongoose');

const { Schema } = mongoose;

const vocabSchema = new Schema(
    {
        english: {
            type: String,
            required: 'English word cannot be blank'
        },
        german: {
            type: String,
            required: 'German word cannot be blank'
        },
        french: {
            type: String,
            required: 'French word cannot be blank'
        }
    },
    { collection: 'vocab3' }
);

module.exports = mongoose.model('Vocab', vocabSchema);