const mongoose = require('mongoose');
const Book = require('./models/Book');
const comicsData = require('./data/comicsData');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_STRING);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Delete all existing books
        await Book.deleteMany({});
        console.log('✓ Cleared existing books');
        
        // Insert new books with images
        const result = await Book.insertMany(comicsData);
        console.log(`✓ Successfully seeded ${result.length} comics with images!`);
        
        // Show a sample
        console.log('\nSample comic with image:');
        console.log(`- ${result[0].title}`);
        console.log(`  Image: ${result[0].imageUrl}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
});
