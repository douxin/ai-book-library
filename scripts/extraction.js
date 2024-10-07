const fs = require('fs');
const path = require('path');
const EPub = require('epub');
const crypto = require('crypto');
const AdmZip = require('adm-zip');

const booksDirectory = path.join(__dirname, '..', 'public', 'books');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'books.json');
const imagesDirectory = path.join(__dirname, '..', 'public', 'images');

function generateId(title, author) {
  const hash = crypto.createHash('md5').update(`${title}${author}`).digest('hex');
  return hash.substring(0, 8);
}

function extractCoverImage(epubPath, bookId) {
  const zip = new AdmZip(epubPath);
  const contentOpfEntry = zip.getEntries().find(entry => entry.entryName.endsWith('content.opf'));

  if (!contentOpfEntry) {
    return null;
  }

  const contentOpf = contentOpfEntry.getData().toString('utf8');
  const coverMatch = contentOpf.match(/<meta name="cover" content="([^"]+)"/);

  if (!coverMatch) {
    return null;
  }

  const coverId = coverMatch[1];
  const coverItemMatch = contentOpf.match(new RegExp(`<item id="${coverId}"[^>]+href="([^"]+)"`));

  if (!coverItemMatch) {
    return null;
  }

  const coverPath = coverItemMatch[1];
  const coverEntry = zip.getEntries().find(entry => entry.entryName.endsWith(coverPath));

  if (!coverEntry) {
    return null;
  }

  const coverData = coverEntry.getData();
  const coverExtension = path.extname(coverPath);
  const outputPath = path.join(imagesDirectory, `${bookId}${coverExtension}`);

  fs.mkdirSync(imagesDirectory, { recursive: true });
  fs.writeFileSync(outputPath, coverData);

  return `/images/${bookId}${coverExtension}`;
}

async function extractBookInfo(filePath) {
  return new Promise((resolve, reject) => {
    const epub = new EPub(filePath);
    
    epub.on('end', () => {
      const bookId = generateId(epub.metadata.title, epub.metadata.creator);
      const coverImagePath = extractCoverImage(filePath, bookId);
      
      const book = {
        id: bookId,
        title: epub.metadata.title,
        author: epub.metadata.creator,
        path: `/books/${path.basename(filePath)}`,
        coverImage: coverImagePath || '',
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