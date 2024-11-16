import { Link, useRouteError } from 'react-router-dom';
import img from '../assets/images/not-found.svg';
const Error = () => {
  const error = useRouteError();
  if (error.status === 404) {
    return (
      <div>
        <div>
          <img src={img} alt='not found' />
          <h3>Ohh! page not found</h3>
          <p>we cannot seem to find the page you are looking for</p>
          <Link to='/dashboard'>back home</Link>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div>
        <h3>something went wrong</h3>
      </div>
    </div>
  );
};
export default Error;