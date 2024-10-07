import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactReader } from 'react-reader';
import booksData from '../data/books.json';

interface Book {
  id: string;
  title: string;
  path: string;
  coverImage: string;
  author: string;
  description: string;
}

const BookReader: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [location, setLocation] = useState<string | number>(0);

  useEffect(() => {
    const selectedBook = booksData.find(b => b.id === bookId);
    setBook(selectedBook || null);
  }, [bookId]);

  const locationChanged = (newLocation: string | number) => {
    setLocation(newLocation);
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book-reader">
      <h1>{book.title}</h1>
      <div style={{ height: '100vh' }}>
        <ReactReader 
          url={book.path}
          location={location}
          locationChanged={locationChanged}
        />
      </div>
    </div>
  );
};

export default BookReader;