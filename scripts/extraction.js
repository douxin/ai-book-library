const fs = require('fs');
const path = require('path');
const EPub = require('epub');
const crypto = require('crypto');

const booksDirectory = path.join(__dirname, '..', 'public', 'books');
const outputFile = path.join(__dirname, 'extracted_books.json');

function generateId(title, author) {
  const hash = crypto.createHash('md5').update(`${title}${author}`).digest('hex');
  return hash.substring(0, 8);
}

async function extractBookInfo(filePath) {
  return new Promise((resolve, reject) => {
    const epub = new EPub(filePath);
    
    epub.on('end', () => {
      const book = {
        id: generateId(epub.metadata.title, epub.metadata.creator),
        title: epub.metadata.title,
        author: epub.metadata.creator,
        path: `/books/${path.basename(filePath)}`,
        coverImage: 'https://static.gptlabs.cloud/default_logo.png',
        description: epub.metadata.description || 'No description available.',
      };
      resolve(book);
    });

    epub.on('error', reject);
    epub.parse();
  });
}

async function extractAllBooks() {
  const files = fs.readdirSync(booksDirectory);
  const epubFiles = files.filter(file => path.extname(file).toLowerCase() === '.epub');
  
  const books = [];
  
  for (const file of epubFiles) {
    const filePath = path.join(booksDirectory, file);
    try {
      const bookInfo = await extractBookInfo(filePath);
      books.push(bookInfo);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  return books;
}

extractAllBooks()
  .then(books => {
    fs.writeFileSync(outputFile, JSON.stringify(books, null, 2));
    console.log(`Extracted book information saved to ${outputFile}`);
  })
  .catch(error => {
    console.error('Error extracting book information:', error);
  });