import React from "react";
import BookList from "./Book/BookList";
import CreateBookForm from "./Book/CreateBookForm";
import { BookService } from "../services/BookService";

function App() {
  const [books, setBooks] = React.useState([]);

  const fetchBooks = async () => {
    try {
      const books = await BookService.listBooks();
      setBooks(books);
    } catch (error) {
      console.error("Fetch Error: ", error);
    }
  };

  React.useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="App">
      <CreateBookForm onCreate={fetchBooks} />
      <BookList books={books} setBooks={setBooks} />
    </div>
  );
}

export default App;
