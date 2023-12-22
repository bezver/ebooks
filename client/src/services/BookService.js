const host = "http://localhost:3001";

export class BookService {
  static async listBooks() {
    const response = await fetch(`${host}/books`);
    return response.json();
  }

  static async createBook(bookData) {
    const response = await fetch(`${host}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    if (response.status !== 201) {
      throw new Error("Failed to create a book");
    }
  }

  static async updateBook(id, bookData) {
    const response = await fetch(`${host}/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    if (response.status !== 200) {
      throw new Error("Failed to update a book");
    }
  }

  static async deleteBook(id) {
    await fetch(`${host}/books/${id}`, {
      method: "DELETE",
    });
  }
}
