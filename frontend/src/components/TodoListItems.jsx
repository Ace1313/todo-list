import React, { useContext } from 'react';
import TodolistItemCard from './TodolistItemCard';
import AuthContext from '../context/Context';
import styled from 'styled-components';

function TodoListItems() {
   const { todo } = useContext(AuthContext);

   return (
      <TodoListItemsWrapper>
         {todo &&
            todo.map((todos) => <TodolistItemCard key={todos.id} {...todos} />)}
      </TodoListItemsWrapper>
   );
}

const TodoListItemsWrapper = styled.ul`
   display: grid;
   grid-template-rows: 1fr;
   justify-items: center;
   padding: 1rem;
   gap: 1rem;
`;

export default TodoListItems;