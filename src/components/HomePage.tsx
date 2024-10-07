import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import booksData from '../data/books.json';

interface Book {
  id: string;
  title: string;
  path: string;
  coverImage: string;
  author: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setBooks(booksData);
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateTitle = (title: string, maxLength: number = 15) => {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
  };

  const generateGradient = (id: string) => {
    const hue = parseInt(id, 16) % 360;
    return `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${(hue + 60) % 360}, 70%, 60%))`;
  };

  return (
    <div className="home-page">
      <header className="header">
        <div className="header-content">
          <h1>My Book Library</h1>
          <p>Discover your next great read</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search books by title or author"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>
      <main className="content">
        <div className="book-shelf">
          {filteredBooks.map((book) => (
            <Link to={`/read/${book.id}`} key={book.id} className="book-card">
              <div className="book-cover">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={`${book.title} cover`} />
                ) : (
                  <div 
                    className="gradient-cover"
                    style={{
                      background: generateGradient(book.id),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      padding: '10px',
                      textAlign: 'center',
                      color: 'white',
                    }}
                  >
                    <span>{truncateTitle(book.title, 30)}</span>
                  </div>
                )}
              </div>
              <div className="book-info">
                <h3 className="book-title">{truncateTitle(book.title)}</h3>
                <p className="book-author">{book.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;