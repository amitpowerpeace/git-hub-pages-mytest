import React from "react";
import TodoItem from "../TodoItem";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Input from "../Input";
import useAddTodo from "../../hooks/useAddTodo";

export const GET_TODOS = gql`
  query getTodos {
    todos {
      id
      type
    }
  }
`;

export const ADD_TODO = gql`
  mutation AddTodo($type: String!) {
    addTodo(type: $type) {
      id
      type
    }
  }
`;

export default function Todos() {
  const { data, loading, error, refetch } = useQuery(GET_TODOS);
  const addTodo = useAddTodo();

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (error) {
    return <h3>ERROR</h3>;
  }

  const onSubmit = type => {
    addTodo({ type });
  };

  console.log(data);

  return (
    <div>
      <button onClick={() => refetch()}>Refetch</button>
      <Input onSubmit={onSubmit} />
      <ul>
        {data.todos.map(elm => (
          <TodoItem key={elm.id} data={elm} />
        ))}
      </ul>
    </div>
  );
}
