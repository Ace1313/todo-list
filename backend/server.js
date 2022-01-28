const { config } = require('dotenv');
const express = require('express');
require('dotenv/config');
config();

const { Pool } = require('pg');
const app = express();
app.use(express.json());

const db = new Pool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASS,
   database: process.env.DB_SOURCE,
});

app.get('/', async (req, res) => {
   const query = `
    CREATE TABLE todolist (
        id SERIAL PRIMARY KEY,
        title VARCHAR(20) NOT NULL,
        todos VARCHAR(55) NOT NULL
    )
    `;
   await db.query(query);
   return res.json({ success: true });
});

app.get('/todos', async (req, res) => {
   try {
      const query = 'SELECT * FROM todolist';
      const data = await db.query(query);
      const todos = data.rows;
      return res.json({ success: true, todos });
   } catch (error) {
      console.log(error);
   }
});

app.post('/insert', async (req, res) => {
   try {
      const { title, todos } = req.body;
      const query = `INSERT INTO todolist (title, todos)
        VALUES ($1, $2) RETURNING* 
        `;
      const values = [title, todos];
      const data = await db.query(query, values);

      return res.json({ success: true, todo: data.rows[0] });
   } catch (error) {
      console.log(error);
   }
});

app.get('/todos/:id', async (req, res) => {
   try {
      const todoId = req.params.id;
      const query = 'SELECT * FROM todolist WHERE id = $1';
      const data = await db.query(query, [todoId]);
      const todo = data.rows[0];

      if (data.rowCount === 0) throw new Error('Todlist not found');

      return res.json({ success: true, todo });
   } catch (error) {
      console.log(error);
   }
});

app.delete('/delete/:id', async (req, res) => {
   try {
      const todoId = req.params.id;

      const query = 'SELECT * FROM todolist WHERE id = $1';

      const data = await db.query(query, [todoId]);

      if (data.rowCount === 0) throw new Error('List with id not found');

      await db.query('DELETE FROM todolist WHERE id = $1', [todoId]);

      return res.json({ success: true, message: 'Todlist deleted' });
   } catch (error) {
      return res.json({ success: false, message: 'Todolist not found' });
   }
});

app.listen(8000, () => {
   console.log('Server Started at port...');
});
