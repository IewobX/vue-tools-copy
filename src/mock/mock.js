import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';
import {
  Todos
} from './data/todoList';

export default {
  /**
   * @author xubowei
   * mock start
   * */
  start() {
    let mock = new MockAdapter(axios);

    mock.onGet('/todo/list').reply(config => {
      let mockTodo = Todos.map(todo => {
        return {
          id: todo.id,
          title: todo.title,
          count: todo.record.filter((data) => {
            if (data.checked === false) return true;
            return true;
          }).length,
          locked: todo.locked,
          isDelete: todo.isDelete
        };
      }).filter(todo => {
        if (todo.isDelete === true) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            todos: mockTodo
          }]);
        }, 200);
      });
    });

    mock.onPost('todo/addTodo').reply(config => {
      Todos.push({
        id: Mock.Random.guid(),
        title: 'newList',
        isDelete: false,
        locked: false,
        record: []
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200]);
        }, 200);
      });
    });
    /**
     * @author xubowei
     * 获取todo单个列表*/
    mock.onGet('/todo/listId').reply(config=>{
      let {
        id
      } = config.params;
      let todo = Todo.find(todo=>{
        return id&&todo.id === id;
      });
      todo.count = todo.record.filter((data)=>{
        return data.checked === false;
      }).length;
      return new Promise((resolve, reject)=>{
        setTimeout(()=>{
          resolve([200,{
            todo: todo
          }]);
        },200);
      });
    });
    /**
     * @author xubowei
     * 新增一条待办事项*/
    mock.onPost('/todo/addRecord').reply(config=>{
      let {
        id,
        text
      } = JSON.parse(config.data);
      Todos.some((t,index)=>{
        if(t.id ===id){
          t.record.push({
            text: text,
            isDelete: false,
            checked: false
          });
          return true;
        }
      });
      return new Promise((resolve, reject)=>{
        setTimeout(()=>{
          resolve([200]);
        },200);
      });
    });
  }
};
