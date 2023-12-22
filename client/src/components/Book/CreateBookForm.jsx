import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import React from "react";
import { BookService } from "../../services/BookService";

export default function CreateBookForm({ onCreate }) {
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");

  const onBookCreate = async () => {
    if (title.trim() === "" || author.trim() === "") {
      alert("Fill fields before submitting");
      return;
    }

    try {
      await BookService.createBook({ title: title, author: author });
      onCreate();
      setTitle("");
      setAuthor("");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Paper sx={{ width: "50%", margin: "15px auto", padding: "15px" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            value={title}
            label="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            value={author}
            label="Author"
            onChange={(e) => setAuthor(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "right" }}>
          <Button
            onClick={onBookCreate}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
