import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import '../styles/Login.css';

type Props = {
  setIsLoggedIn: () => void;
};

export default function Login({ setIsLoggedIn }: Props) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formFields, setFields] = useState({
    username: '',
    email: '',
    password: '',
  });

  const submit = async (type = 'login') => {
    try {
      const res = await fetch(`http://localhost:8000/${type}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formFields),
      });
      const data = await res.json();
      console.log(data);
      if (data.username == formFields.username) {
        setIsLoggedIn();
      } else {
        alert(
          data.username
            ? data.username
            : data.email
            ? data.email
            : data.password
            ? data.password
            : data.non_field_errors,
        );
      }
    } catch (err: any) {
      alert(err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFields({ ...formFields, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setFields({ username: '', email: '', password: '' });
  }, [isSignUp]);

  return (
    <Fragment>
      {isSignUp ? (
        <div className='form-container'>
          <h1>Signup</h1>
          <form>
            <label>Name</label>
            <input
              type='text'
              value={formFields.username}
              onChange={handleChange}
              name='username'
              required
            />
            <label>Email</label>
            <input
              type='email'
              value={formFields.email}
              onChange={handleChange}
              name='email'
              required
            />
            <label>Password</label>
            <input
              type='password'
              value={formFields.password}
              onChange={handleChange}
              name='password'
              required
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                submit('register');
              }}
            >
              Signup
            </button>
          </form>
          <p>
            Already have an account?{' '}
            <a href='#' onClick={() => setIsSignUp(false)}>
              Login
            </a>
          </p>
        </div>
      ) : (
        <div className='form-container'>
          <h1>Login</h1>
          <form>
            <label>Name</label>
            <input
              type='text'
              value={formFields.username}
              onChange={handleChange}
              name='username'
              required
            />
            <label>Password</label>
            <input
              type='password'
              value={formFields.password}
              onChange={handleChange}
              name='password'
              required
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              Login
            </button>
          </form>
          <p>
            No account?{' '}
            <a href='#' onClick={() => setIsSignUp(true)}>
              Sign Up
            </a>
          </p>
        </div>
      )}
    </Fragment>
  );
}
