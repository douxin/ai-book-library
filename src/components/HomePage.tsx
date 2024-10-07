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
                <img src={book.coverImage} alt={`${book.title} cover`} />
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
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