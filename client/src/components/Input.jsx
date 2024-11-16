const Input = ({ type, placeholder, value, onChange, className , name }) => (
  <input
    name={name}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={className}
  />
);
export default Input 