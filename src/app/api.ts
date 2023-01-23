export namespace API {
  export function getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }

  export function getPostsByUserId(userId: number): Promise<Post[]> {
    const q = new URLSearchParams({
      userId: userId.toString(),
    });
    return new Promise((resolve, reject) => {
      fetch('https://jsonplaceholder.typicode.com/posts?' + q, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }

  export function deletePost(postId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      fetch('https://jsonplaceholder.typicode.com/posts/' + postId, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(() => resolve(postId))
        .catch((err) => reject(err));
    });
  }

  export function editPost(post: Post): Promise<Post> {
    const q = new URLSearchParams(post as Record<any, any>);
    return new Promise((resolve, reject) => {
      fetch('https://jsonplaceholder.typicode.com/posts/' + post.id, {
        method: 'PUT',
        body: q,
      })
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }

  export function getTodos(todoFilter?: Partial<Todo>): Promise<Todo[]> {
    let suffix = '';
    if (todoFilter) {
      const q = new URLSearchParams(todoFilter as Record<any, any>);
      suffix = '?' + q;
    }
    return new Promise((resolve, reject) => {
      fetch('https://jsonplaceholder.typicode.com/todos' + suffix, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  },
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  }
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
