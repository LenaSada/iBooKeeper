import axios from "axios";

function App() {

  const testConnection = async () => {
    const response = await axios.get('http://localhost:3100/');
    console.log(response.data);
  }

  return (
    <div>
      <header>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={testConnection}>
          test server connection
        </button>
      </header>
    </div>
  );
}

export default App;
