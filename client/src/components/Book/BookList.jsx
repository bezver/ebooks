import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UpdateIcon from "@mui/icons-material/Update";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import React from "react";
import { BookService } from "../../services/BookService";

const columns = [
  { id: "title", label: "Title" },
  { id: "author", label: "Author" },
  { id: "action", label: "Action" },
];

export default function BookList({ books, setBooks }) {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [editingBook, setEditingBook] = React.useState(null);

  const isFormValid = books.some(
    (book) =>
      book.id === editingBook?.id &&
      book.title.trim() !== "" &&
      book.author.trim() !== ""
  );

  const onPageChange = (e, newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const onRowsPerPageChange = (e) => {
    setRowsPerPage(Number.parseInt(e.target.value));
    setPageNumber(0);
  };

  const onFieldChange = (bookId, field, value) => {
    const book = books.find((it) => it.id === bookId);

    if (book) {
      book[field] = value;
      setBooks(books.slice());
    }
  };

  const onCancelEdit = () => {
    const book = books.find((it) => it.id === editingBook.id);
    Object.assign(book, editingBook);

    setBooks(books.slice());
    setEditingBook(null);
  };

  const onUpdateBook = async (book) => {
    try {
      await BookService.updateBook(book.id, {
        title: book.title,
        author: book.author,
      });
      setEditingBook(null);
    } catch (error) {
      console.error("An error occurred while updating a book:", error);
    }
  };

  const onDeleteBook = async (bookId) => {
    try {
      await BookService.deleteBook(bookId);
      setBooks(books.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("An error occurred while deleting a book:", error);
    }
  };

  return (
    <Paper
      sx={{
        width: "50%",
        margin: "0 auto",
      }}
    >
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ fontWeight: "bold" }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {books
              .slice(
                pageNumber * rowsPerPage,
                pageNumber * rowsPerPage + rowsPerPage
              )
              .map((book) => (
                <TableRow key={book.id} hover>
                  {columns.map((column) => {
                    let content = null;

                    if (column.id === "action") {
                      content = (
                        <Stack direction="row" spacing={2}>
                          {editingBook?.id === book.id ? (
                            <>
                              <Button
                                onClick={onCancelEdit}
                                variant="outlined"
                                startIcon={<CancelIcon />}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => onUpdateBook(book)}
                                disabled={!isFormValid}
                                variant="outlined"
                                startIcon={<UpdateIcon />}
                              >
                                Update
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => onDeleteBook(book.id)}
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                              >
                                Delete
                              </Button>
                              <Button
                                onClick={() => setEditingBook({ ...book })}
                                variant="outlined"
                                startIcon={<EditIcon />}
                              >
                                Edit
                              </Button>
                            </>
                          )}
                        </Stack>
                      );
                    } else {
                      if (editingBook?.id === book.id) {
                        content = (
                          <TextField
                            value={book[column.id]}
                            onChange={(e) =>
                              onFieldChange(book.id, column.id, e.target.value)
                            }
                          />
                        );
                      } else {
                        content = book[column.id];
                      }
                    }

                    return (
                      <TableCell key={column.id} sx={{ width: "50%" }}>
                        {content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        page={pageNumber}
        count={books.length}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}
