import toast from "react-hot-toast";

function TestComponent() {
  const handleClick = () => {
    toast.error("This is a test error message", { duration: 1000 });
  };

  return (
    <div>
      <button onClick={handleClick}>Show Toast</button>
    </div>
  );
}

export default TestComponent;
